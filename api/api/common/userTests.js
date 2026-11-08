import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
const identity = {
    name: 'Verified member',
    roles: ['user'],
    uuid: 'verifiedUuid'
}
let selected
mock.module('core', {
    exports: {
        clientError: code => {
            throw new Error(code)
        },
        providers: {
            identity,
            user: 'verifiedUuid'
        }
    }
})
mock.module('accountsBusiness', {
    exports: {
        syncUserByUuid: async params => {
            selected = params
            return params
        }
    }
})
const { default: actions } = await import('./user.js')
test('self-service synchronization cannot replace the verified identity or attach an owner person', async () => {
    await actions.syncByUuidOnPost({
        body: {
            person: 'businessOwner',
            roles: ['admin'],
            uuid: 'forgedUuid'
        }
    })
    assert.equal(selected.uuid, 'verifiedUuid')
    assert.equal(selected.identity, identity)
    assert.equal(selected.body, undefined)
    assert.equal(selected.query, undefined)
    assert.equal(actions.syncOnPost, actions.syncByUuidOnPost)
})
test('an existing administrator keeps the explicit synchronization contract', async () => {
    identity.roles = ['admin']
    const parameters = { body: { uuid: 'managedUser' } }
    await actions.syncByUuidOnPost(parameters)
    assert.equal(selected, parameters)
})
