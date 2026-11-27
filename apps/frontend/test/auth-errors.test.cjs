const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const ts = require("typescript");
const axios = require("axios");

function loadSource(path, modules) {
	const source = readFileSync(join(__dirname, "../src", path), "utf8").replaceAll(
		"import.meta.env.VITE_BACKEND_URL",
		'""'
	);
	const compiled = ts.transpileModule(source, {
		compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
	}).outputText;
	const module = { exports: {} };
	new Function("require", "module", "exports", compiled)(
		name => {
			if (!(name in modules)) throw new Error(`Unexpected import: ${name}`);
			return modules[name];
		},
		module,
		module.exports
	);
	return module.exports;
}

const { getAuthErrorMessage } = loadSource("lib/authError.ts", { axios });
const fallback = "Unable to sign in. Please try again.";
const credentials = "Incorrect email or password. Please try again.";

function responseError(status, data, url = "/api/auth/sign-in") {
	return new axios.AxiosError("Request failed", undefined, { url }, undefined, {
		status,
		data
	});
}

test("shows backend messages for duplicate accounts and custom auth failures", () => {
	assert.equal(
		getAuthErrorMessage(responseError(400, { message: "User with this email already exists" }), fallback),
		"User with this email already exists"
	);
	assert.equal(
		getAuthErrorMessage(responseError(401, { message: "Email not verified." }), fallback, credentials),
		"Email not verified."
	);
	assert.equal(
		getAuthErrorMessage(responseError(400, { message: ["First error", "Second error"] }), fallback),
		"First error, Second error"
	);
});

test("uses a useful credentials message for generic 401 and fallbacks for missing messages", () => {
	assert.equal(getAuthErrorMessage(responseError(401, { message: "Unauthorized" }), fallback, credentials), credentials);
	assert.equal(getAuthErrorMessage(responseError(401, { message: "Unauthorized" }, "/api/auth/current-user"), fallback, credentials), "Unauthorized");
	assert.equal(getAuthErrorMessage(responseError(500, { message: "Unauthorized" }), fallback, credentials), "Unauthorized");
	assert.equal(getAuthErrorMessage(responseError(400, {}), fallback), fallback);
	assert.equal(getAuthErrorMessage(responseError(400, { message: [] }), fallback), fallback);
	assert.equal(getAuthErrorMessage(new axios.AxiosError("Network Error"), fallback), fallback);
	assert.equal(getAuthErrorMessage(new Error("unexpected"), fallback), fallback);
});

test("sign-in mutation delegates to the session login and propagates failures", async () => {
	const calls = [];
	const failure = responseError(401, { message: "Unauthorized" });
	let shouldFail = false;
	const login = async (email, password) => {
		calls.push([email, password]);
		if (shouldFail) throw failure;
	};
	const { default: useAuth } = loadSource("hooks/useAuth.ts", {
		axios,
		"@tanstack/react-query": {
			useMutation: options => options,
			useQueryClient: () => ({ invalidateQueries: async () => {} })
		},
		"react-router-dom": { useSearchParams: () => [new URLSearchParams()] },
		"../stores/auth.store": { useAuthStore: selector => selector({ login }) }
	});
	const { signIn } = useAuth();
	await signIn.mutationFn({ email: "reader@example.com", password: "password" });
	shouldFail = true;
	await assert.rejects(
		signIn.mutationFn({ email: "reader@example.com", password: "wrong" }),
		error => error === failure
	);
	assert.deepEqual(calls, [
		["reader@example.com", "password"],
		["reader@example.com", "wrong"]
	]);
});

test("does not refresh the session for a rejected sign-in", async () => {
	let interceptor;
	let refreshCalls = 0;
	const client = { interceptors: { response: { use: (_, onError) => { interceptor = onError; } } } };
	const refreshClient = { post: async () => { refreshCalls++; } };
	let creations = 0;
	loadSource("lib/api.ts", {
		axios: { default: { create: () => ++creations === 1 ? client : refreshClient } }
	});
	const failure = { config: { url: "/api/auth/sign-in" }, response: { status: 401 } };
	await assert.rejects(interceptor(failure), error => error === failure);
	assert.equal(refreshCalls, 0);
});
