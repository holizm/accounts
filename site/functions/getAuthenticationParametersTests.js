import assert from 'assert/strict'
import test from 'node:test'
import provideEnvironment from '../testing/authenticationEnvironment.js'

test('authentication parameters keep tenant and private-setting resolution', async context => {
    const state = provideEnvironment(context)
    const { default: getParameters } = await import('./getAuthenticationParameters.jsx')
    const env = { get: key => key }
    state.privateSettings = { authSecret: 'privateAuth' }
    const first = await getParameters(env, new URL('https://first.example'))
    assert.equal(first.authSecret, 'privateAuth')
    assert.equal(first.accountsRealm, 'realm')
    assert.equal(first.accountsClient, 'site')
    assert.equal(await getParameters(env, new URL('https://first.example')), first)
    globalThis.settings.accounts = { client: 'selectedClient' }
    const second = await getParameters(env, new URL('https://second.example'))
    assert.equal(second.accountsClient, 'selectedClient')
})
