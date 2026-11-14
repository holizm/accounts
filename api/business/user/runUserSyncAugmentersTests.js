import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'

let augmenters = []
mock.module('core', { namedExports: { loadGlobalModifiers: async name => {
    assert.equal(name, 'userSyncAugmenter')
    return augmenters
} } })
const { default: run } = await import('./runUserSyncAugmenters.js')

test('supports absent optional parts and awaits each registered augmenter', async () => {
    const user = { person: 'person' }
    await run(user)
    const calls = []
    augmenters = [{ method: async params => {
        await Promise.resolve()
        calls.push(params.user)
    } }]
    await run(user)
    assert.deepEqual(calls, [user])
    augmenters = [{ method: async () => { throw new Error('failed') } }]
    await assert.rejects(run(user), /failed/)
})
