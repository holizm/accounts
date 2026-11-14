import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
let existing
let created
const augmented = []
let duplicate = false
let lookup
mock.module('core', {
    exports: {
        loadGlobalModifiers: async () => [{ method: async ({ user }) => {
            assert.ok(user.person)
            augmented.push(user)
        } }],
        clientError: code => {
            throw new Error(code)
        },
        create: async params => {
            if (duplicate) {
                existing = { person: { id: 'canonicalPerson' }, uuid: params.uuid }
                throw Object.assign(new Error('duplicate'), { code: 11000 })
            }
            created = params
            return { ...params, person: { id: 'person' } }
        },
        dbItem: async params => {
            lookup = params
            return existing
        },
        dbUpdateItem: async params => params.item,
        providers: {
            tenant: 'tenantA',
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
        person: { id: 'person' },
        username: 'previousName'
    }
    const updated = await syncUserByUuid({})
    assert.equal(updated.id, 'existingAccount')
    assert.equal(updated.username, 'verifiedMember')
    assert.ok(updated.lastSyncDate instanceof Date)
    assert.equal(augmented.length, 2)
    assert.equal(augmented[1], updated)
})

test('account lookup spans locales within one tenant and recovers concurrent creation', async () => {
    existing = null
    duplicate = true
    const user = await syncUserByUuid({})
    assert.equal(user.person.id, 'canonicalPerson')
    assert.equal(lookup.acrossLocales, true)
    assert.equal(lookup.query.tenant, 'tenantA')
    assert.equal(lookup.query.uuid, 'verifiedUuid')
    assert.equal(augmented.at(-1), user)
})
