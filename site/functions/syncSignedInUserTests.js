import assert from 'assert/strict'
import test from 'node:test'
import provideEnvironment from '../testing/authenticationEnvironment.js'

test('both provider and credential logins synchronize using verified access tokens', async context => {
    const state = provideEnvironment(context)
    const { default: sync } = await import('./syncSignedInUser.jsx')
    const request = { url: new URL('https://shop.example') }
    await sync({
        account: { access_token: 'providerToken' },
        profile: { sub: 'untrustedBodyUuid' },
    }, request)
    assert.equal(state.requests[0].options.headers.authorization, 'Bearer providerToken')
    assert.equal(state.requests[0].url, '/accounts/user/syncByUuid')
    assert.deepEqual(state.requests[0].body, {})
    assert.equal(state.requests[0].request, request)
    await sync({ user: { access_token: 'credentialToken' } }, request)
    assert.equal(state.requests[1].options.headers.authorization, 'Bearer credentialToken')
    state.failure = new Error('synchronizationFailed')
    await assert.rejects(sync({ user: { access_token: 'token' } }, request), /synchronizationFailed/)
})
