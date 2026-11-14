import assert from 'assert/strict'
import test from 'node:test'
import provideEnvironment from '../testing/authenticationEnvironment.js'

test('credential exchange preserves OTP authentication and its failure behavior', async context => {
    const state = provideEnvironment(context)
    const { default: authorize } = await import('./authorizeCredentials.jsx')
    assert.equal(await authorize({}, {}), null)
    assert.equal(state.requests.length, 0)
    const credentials = { otp: '12345', phone: 'testPhone' }
    assert.equal(await authorize(credentials, {}), state.result)
    assert.equal(state.requests[0].url, '/accounts/signIn')
    assert.deepEqual(state.requests[0].body, credentials)
    state.failure = new Error('invalidOtp')
    assert.equal(await authorize(credentials, {}), null)
})
