import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
import roleAccessHarness from './test/roleAccessHarnessTest.js'

const harness = roleAccessHarness()
mock.module('core', { exports: { clientError: code => { throw new Error(code) } } })
mock.module('../iam.js', {
    exports: {
        iamGet: harness.iamGet,
        iamPost: harness.iamPost,
        iamPut: harness.iamPut,
    },
})
const { ensureRoleAccessUser } = await import('./ensureRoleAccessUser.js')
const { addRealmRole } = await import('./addRealmRole.js')
const sourceTenant = {
    accountsOrigin: 'https://accounts.example.com',
    realm: 'source',
}
const tenantConfiguration = {
    accountsOrigin: 'https://accounts.example.com',
    realm: 'target',
}
const identity = { uuid: 'actorUuid' }

test('same realm reuses the authenticated account without provisioning', async () => {
    const result = await ensureRoleAccessUser({
        identity,
        sourceTenant,
        tenantConfiguration: sourceTenant,
    })
    assert.equal(result.uuid, identity.uuid)
    assert.equal(harness.state.posts.length, 0)
})

test('cross realm creates an SSO linked account and denies unlinked broker logins', async () => {
    const result = await ensureRoleAccessUser({
        identity,
        sourceTenant,
        tenantConfiguration,
    })
    assert.equal(result.uuid, 'targetUuid')
    assert.equal(harness.state.links[0].userId, identity.uuid)
    assert.equal(harness.state.executions[0].requirement, 'REQUIRED')
    assert.equal(harness.state.providers[0].firstBrokerLoginFlowAlias, 'supportAccessOnly')
    assert.equal(harness.state.providers[0].linkOnly, false)
    assert.equal(harness.state.user.credentials, undefined)
    assert.equal(harness.state.user.email, harness.sourceUser.email)
    assert.equal(harness.state.user.emailVerified, true)
    const postCount = harness.state.posts.length
    await ensureRoleAccessUser({
        identity,
        sourceTenant,
        tenantConfiguration,
    })
    assert.equal(harness.state.posts.length, postCount)
})

test('role grant is additive and idempotent', async () => {
    const params = {
        role: 'manager',
        tenantConfiguration,
        uuid: 'targetUuid',
    }
    await addRealmRole(params)
    const postCount = harness.state.posts.length
    await addRealmRole(params)
    assert.equal(harness.state.posts.length, postCount)
    assert.deepEqual(harness.state.mappings.map(role => role.name), ['guest', 'manager'])
})

test('a username collision cannot take over an unrelated target account', async () => {
    harness.state.links = []
    await assert.rejects(ensureRoleAccessUser({
        identity,
        sourceTenant,
        tenantConfiguration,
    }), /userIdentityFetchFailed/)
})

test('disabled source accounts cannot be provisioned', async () => {
    harness.sourceUser.enabled = false
    await assert.rejects(ensureRoleAccessUser({ identity, sourceTenant, tenantConfiguration }), /userIdentityFetchFailed/)
})
