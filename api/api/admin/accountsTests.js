import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
mock.module('accountsBusiness', {
    namedExports: {
        configure: async () => 'configured',
        getRecordVisibility: async () => 'visibility',
        setRecordVisibility: async () => 'saved'
    }
})
const { default: actions } = await import('./accounts.js')
test('record visibility editing is POST-only and preserves existing account configuration', async () => {
    assert.equal(await actions.configureOnPost(), 'configured')
    assert.equal(await actions.recordVisibility(), 'visibility')
    assert.equal(await actions.setRecordVisibilityOnPost(), 'saved')
    assert.equal(actions.setRecordVisibility, undefined)
})
