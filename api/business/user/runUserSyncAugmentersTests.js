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
    let trigger
    augmenters = [{ method: async params => {
        await Promise.resolve()
        calls.push(params.user)
        trigger = params.trigger
    } }]
    await run(user, 'otpRequest')
    assert.deepEqual(calls, [user])
    assert.equal(trigger, 'otpRequest')
    augmenters = [{ method: async () => { throw new Error('failed') } }]
    await assert.rejects(run(user), /failed/)
})
