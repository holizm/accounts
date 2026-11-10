import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'

let user
mock.module('./getUser.js', { exports: { getUser: async () => user } })
mock.module('core', { exports: { ensure: value => {
    const assertion = { isSomething: message => {
        if (!value) throw new Error(message)
    } }
    return assertion
} } })
const { getUserContext } = await import('./getUserContext.js')

test('account context resolves populated and plain person and contact references', async () => {
    user = { person: { contact: { id: 'contact' }, id: 'person' } }
    assert.deepEqual(await getUserContext(), { contactId: 'contact', personId: 'person', user })
    user = { contact: 'contact', person: 'person' }
    assert.deepEqual(await getUserContext(), { contactId: 'contact', personId: 'person', user })
    user = {}
    await assert.rejects(getUserContext(), /userPersonNotFound/)
})
