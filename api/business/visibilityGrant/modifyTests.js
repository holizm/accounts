import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
mock.module('core', {
    namedExports: {
        dbItem: async () => {
            const result = { username: 'ali' }
            return result
        },
        translateInternally: async key => key === 'allRecords' ? 'All records' : 'Not found'
    }
})
mock.module('../user/getVisibilityTarget.js', {
    defaultExport: async () => {
        const result = { title: 'Valiasr workshop' }
        return result
    }
})
const { default: modify } = await import('./modify.js')
test('grant listings distinguish a selected scope from tenant-wide access', async () => {
    const items = [{ tenantWide: true }, { tenantWide: false }]
    await modify({ items })
    assert.deepEqual(items.map(item => item.title), ['All records', 'Valiasr workshop'])
    assert.ok(items.every(item => item.userName === 'ali'))
})
