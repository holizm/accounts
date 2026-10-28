import assert from 'assert/strict'
import test from 'node:test'
import getVisibilityVersion from './getVisibilityVersion.js'
import fixtures from '../visibilityFixturesTests.js'
const fixture = await fixtures()
test('the review version changes when visibility changes and distinguishes missing from private-empty records', () => {
    assert.equal(getVisibilityVersion([fixture.ids.branchA]), getVisibilityVersion([fixture.ids.branchA]))
    assert.notEqual(getVisibilityVersion([fixture.ids.branchA]), getVisibilityVersion([fixture.ids.branchB]))
    assert.notEqual(getVisibilityVersion(undefined), getVisibilityVersion([]))
})
