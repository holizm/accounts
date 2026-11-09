import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
import fixtures from '../../testing/business/visibilityEnvironmentProvider.js'
const fixture = await fixtures()
const ids = [fixture.ids.branchA, fixture.ids.branchB]
mock.module('../user/getVisibilityRecord.js', {
    defaultExport: async () => {
        const result = {
            id: fixture.ids.own,
            visibleTo: ids
        }
        return result
    }
})
mock.module('core', {
    namedExports: {
        dbItem: async params => {
            const result = { title: params.id === fixture.ids.branchA ? 'Valiasr workshop' : 'Tabriz workshop' }
            return result
        },
        doesTypeBelongToPart: () => true,
        parseId: fixture.parseId,
        translateInternally: async () => 'Not found'
    }
})
const { getRecordVisibility } = await import('./getRecordVisibility.js')
test('the editor returns readable labels for every existing visibility reference', async () => {
    const result = await getRecordVisibility({ query: { record: fixture.ids.own } })
    assert.deepEqual(result.visibleTo, ids)
    assert.deepEqual(result.scopes.map(scope => scope.title), ['Valiasr workshop', 'Tabriz workshop'])
})
