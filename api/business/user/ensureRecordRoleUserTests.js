import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
let existing = null
let account = null
let saved
let writes = 0
const grants = []
mock.module('./ensureRealmUserLinks.js', { exports: { default: async () => {} } })
mock.module('./addRealmRole.js', { exports: { addRealmRole: async value => grants.push(value) } })
mock.module('../iam.js', { exports: {
    iamGet: async path => path.includes('?') ? account ? [account] : [] : account,
    iamPost: async (path, profile) => {
        writes++
        account = {
            ...profile,
            id: 'existingUuid',
        }
    },
    iamPut: async () => { throw new Error('Unexpected profile overwrite') },
} })
mock.module('core', { exports: {
    clientError: code => { throw new Error(code) },
    context: {
        getStore: () => new Map(),
        run: async (store, work) => {
            assert.equal(store.get('tenant'), 'target')
            return await work()
        },
    },
    getCollection: async part => {
        const collection = { findOne: async () => part === 'tenants' ? { id: 'target' } : existing }
        return collection
    },
    getOrCreateAndGet: async (query, model) => {
        if (query.type === 'tenantPerson') return model.body
        saved = model.body
        existing = model.body
        return existing
    },
} })
const { default: ensure } = await import('./ensureRecordRoleUser.js')
const candidate = {
    contact: { id: 'contact' },
    name: 'Existing worker',
    person: { id: 'person' },
}
const target = {
    tenant: 'target',
    tenantConfiguration: {},
}
test('record provisioning reuses people, creates once and preserves the account identity on retry', async () => {
    const first = await ensure({ candidate, role: 'maintenance', target })
    const second = await ensure({ candidate, role: 'maintenance', target })
    assert.equal(first.uuid, second.uuid)
    assert.equal(writes, 1)
    assert.equal(saved.person, candidate.person)
    assert.equal(saved.contact, candidate.contact)
    assert.equal(account.credentials, undefined)
    assert.equal(account.email, undefined)
    assert.equal(grants.at(-1).role, 'maintenance')
})
test('disabled existing identities are neither enabled nor replaced', async () => {
    account.enabled = false
    const count = writes
    await assert.rejects(ensure({ candidate, role: 'maintenance', target }), /userIdentityFetchFailed/)
    assert.equal(writes, count)
    account.enabled = true
})

test('synthetic records can satisfy IAM profile requirements without inventing real contact addresses', async () => {
    existing = null
    account = null
    await ensure({
        candidate: {
            ...candidate,
            sample: true,
        },
        role: 'staff',
        target,
    })
    assert.match(account.email, /@example\.invalid$/)
    assert.equal(account.emailVerified, false)
})
