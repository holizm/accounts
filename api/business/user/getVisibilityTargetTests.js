import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
import fixtures from '../visibilityFixturesTests.js'
const fixture = await fixtures()
let exists = true
mock.module('core', {
    namedExports: {
        dbItem: async () => exists ? { title: 'Valiasr workshop' } : null,
        doesTypeBelongToPart: () => true,
        parseId: fixture.parseId,
        translateInternally: async () => 'Not found'
    }
})
const { default: getVisibilityTarget } = await import('./getVisibilityTarget.js')
test('visibility references have readable labels and a deleted target does not crash the editor', async () => {
    assert.equal((await getVisibilityTarget(fixture.ids.branchA)).title, 'Valiasr workshop')
    exists = false
    assert.equal((await getVisibilityTarget(fixture.ids.branchA)).title, 'Not found')
})
