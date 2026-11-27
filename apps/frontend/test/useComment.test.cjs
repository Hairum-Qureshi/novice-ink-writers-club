const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const ts = require("typescript");

function setup(storyId, failure) {
	const requests = [];
	const invalidations = [];
	const response = [{ id: "comment-1", storyId: "story-1" }];
	const api = Object.fromEntries(
		["get", "post", "patch", "delete"].map(method => [
			method,
			async (...args) => {
				requests.push([method, ...args]);
				if (failure) throw failure;
				return { data: response };
			}
		])
	);
	const query = {
		useQuery: options => options,
		useMutation: options => options,
		useQueryClient: () => ({
			invalidateQueries: async options => {
				invalidations.push(options);
			}
		})
	};
	const source = readFileSync(join(__dirname, "../src/hooks/useComment.ts"), "utf8");
	const compiled = ts.transpileModule(source, {
		compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
	}).outputText;
	const module = { exports: {} };
	const modules = {
		"@tanstack/react-query": query,
		"react-router-dom": { useParams: () => ({ storyId }) },
		"../lib/api": { api }
	};
	new Function("require", "module", "exports", compiled)(
		name => {
			if (!(name in modules)) throw new Error(`Unexpected import: ${name}`);
			return modules[name];
		},
		module,
		module.exports
	);
	return { hook: module.exports.default(), requests, invalidations, response };
}

test("fetches comments for the current story", async () => {
	const { hook, requests, response } = setup("story/1");
	assert.equal(hook.getComments.enabled, true);
	assert.deepEqual(hook.getComments.queryKey, ["comments", "story/1"]);
	assert.equal(await hook.getComments.queryFn(), response);
	assert.deepEqual(requests, [["get", "/api/comments/story%2F1"]]);
});

test("creates, edits and deletes comments using the endpoint contracts", async () => {
	const { hook, requests, invalidations, response } = setup("story/1");
	assert.equal(await hook.createComment.mutationFn("hello"), undefined);
	assert.equal(
		await hook.editComment.mutationFn({ commentId: "comment/1", comment: "edited" }),
		response
	);
	assert.equal(await hook.deleteComment.mutationFn("comment/1"), response);
	await hook.createComment.onSuccess();
	await hook.editComment.onSuccess();
	await hook.deleteComment.onSuccess();
	assert.deepEqual(requests, [
		["post", "/api/comments/story%2F1/new", { comment: "hello" }],
		["patch", "/api/comments/comment%2F1/edit", { comment: "edited" }],
		["delete", "/api/comments/comment%2F1/delete"]
	]);
	assert.deepEqual(invalidations, [
		{ queryKey: ["comments"] },
		{ queryKey: ["comments"] },
		{ queryKey: ["comments"] }
	]);
});

test("does not fetch or create without a story ID", async () => {
	const { hook, requests } = setup(undefined);
	assert.equal(hook.getComments.enabled, false);
	await assert.rejects(hook.getComments.queryFn(), /story ID is required/);
	await assert.rejects(hook.createComment.mutationFn("hello"), /story ID is required/);
	assert.deepEqual(requests, []);
});

test("propagates request errors", async () => {
	const failure = new Error("Request failed");
	const { hook, invalidations } = setup("story-1", failure);
	await assert.rejects(hook.getComments.queryFn(), error => error === failure);
	await assert.rejects(hook.createComment.mutationFn("hello"), error => error === failure);
	await assert.rejects(
		hook.editComment.mutationFn({ commentId: "comment-1", comment: "edited" }),
		error => error === failure
	);
	await assert.rejects(hook.deleteComment.mutationFn("comment-1"), error => error === failure);
	assert.deepEqual(invalidations, []);
});
