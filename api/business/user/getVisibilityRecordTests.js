import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
import fixtures from '../../testing/business/visibilityEnvironmentProvider.js'
const fixture = await fixtures()
let requested
mock.module('./assertVisibilityAdministrator.js', { defaultExport: () => {} })
mock.module('core', {
    namedExports: {
        clientError: fixture.clientError,
        dbItem: async params => {
            requested = params
            const result = { id: params.id }
            return result
        },
        doesTypeBelongToPart: () => true,
        parseId: fixture.parseId,
        providers: { tenant: 'tenantA' }
    }
})
const { default: getVisibilityRecord } = await import('./getVisibilityRecord.js')
test('the metadata editor resolves the real record type and rejects foreign tenant ids', async () => {
    assert.equal((await getVisibilityRecord(fixture.ids.own)).id, fixture.ids.own)
    assert.equal(requested.part, 'tasks')
    assert.equal(requested.type, 'task')
    assert.equal(requested.acrossLocales, true)
    await assert.rejects(getVisibilityRecord(fixture.ids.foreign), e => e.code === 'forbidden')
})
