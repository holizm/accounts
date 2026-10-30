import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
const calls = []
mock.module('core', { exports: {
    clientError: code => { throw new Error(code) },
    context: {
        getStore: () => new Map([['tenant', 'controller']]),
        run: async (store, work) => {
            assert.equal(store.get('tenant'), 'target')
            assert.equal(store.get('tenantItem').id, 'target')
            assert.equal(store.get('locale'), 'shared')
            return await work()
        },
    },
    getCollection: async () => {
        const collection = { findOne: async () => ({ id: 'target' }) }
        return collection
    },
    getOrCreateAndGet: async (query, model) => calls.push({
        model,
        query,
    }),
} })
const { default: ensure } = await import('./ensureRoleUserRecords.js')
const params = {
    account: { id: 'uuid' },
    candidate: {
        contact: { id: 'contact' },
        person: { id: 'person' },
    },
    target: { tenant: 'target' },
    username: 'existingName',
}
test('provisioned users retain their existing person and gain the explicit tenant membership', async () => {
    await ensure(params)
    assert.equal(calls[0].model.body.person, params.candidate.person)
    assert.equal(calls[0].model.body.uuid, 'uuid')
    assert.equal(calls[1].query.type, 'tenantPerson')
    assert.deepEqual(calls[1].query.query, {
        person: 'person',
        tenant: 'target',
    })
    calls.length = 0
    await ensure({
        ...params,
        existing: { uuid: 'uuid' },
    })
    assert.equal(calls.length, 1)
    assert.equal(calls[0].query.type, 'tenantPerson')
})
