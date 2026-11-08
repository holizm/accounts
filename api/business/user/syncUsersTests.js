import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
const requests = []
mock.module('../iam.js', {
    exports: {
        iamGet: async () => [{
            email: 'member@example.invalid',
            id: 'verifiedUuid',
            username: 'verifiedMember'
        }]
    }
})
mock.module('./syncUserByUuid.js', {
    exports: {
        syncUserByUuid: async params => {
            requests.push(params)
            return params.identity.uuid
        }
    }
})
const { default: synchronize } = await import('./syncUsers.js')
test('bulk synchronization keeps using the existing identity synchronizer after its public export', async () => {
    assert.deepEqual(await synchronize({ host: 'fixture.invalid' }), ['verifiedUuid'])
    assert.equal(requests[0].identity.userName, 'verifiedMember')
    assert.equal(requests[0].identity.email, 'member@example.invalid')
    assert.equal(requests[0].host, 'fixture.invalid')
})
