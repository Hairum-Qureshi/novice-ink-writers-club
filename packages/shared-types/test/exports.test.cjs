const assert = require("node:assert/strict");
const { test } = require("node:test");

test("the built package can be required and validates user settings", () => {
	const { userSettingsSchema } = require("@repo/shared-types");

	assert.equal(
		userSettingsSchema.safeParse({ grade: "freshman", gender: "male" }).success,
		true
	);
	assert.equal(userSettingsSchema.safeParse({ grade: "invalid" }).success, false);
});
