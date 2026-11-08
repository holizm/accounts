import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
let existing
let created
mock.module('core', {
    exports: {
        clientError: code => {
            throw new Error(code)
        },
        create: async params => {
            created = params
            return params
        },
        dbItem: async () => existing,
        dbUpdateItem: async params => params.item,
        providers: {
            identity: {
                userName: 'verifiedMember',
                uuid: 'verifiedUuid'
            }
        }
    }
})
const { syncUserByUuid } = await import('./syncUserByUuid.js')
test('the public account synchronizer retains identity-based creation and existing-record updates', async () => {
    await syncUserByUuid({ meaning: 'member' })
    assert.equal(created.uuid, 'verifiedUuid')
    assert.equal(created.username, 'verifiedMember')
    assert.equal(created.part, 'accounts')
    existing = {
        id: 'existingAccount',
        username: 'previousName'
    }
    const updated = await syncUserByUuid({})
    assert.equal(updated.id, 'existingAccount')
    assert.equal(updated.username, 'verifiedMember')
    assert.ok(updated.lastSyncDate instanceof Date)
})
