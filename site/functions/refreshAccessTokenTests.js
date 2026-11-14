import assert from 'assert/strict'
import test from 'node:test'
import provideEnvironment from '../testing/authenticationEnvironment.js'

test('token refresh keeps the existing provider exchange contract', async context => {
    provideEnvironment(context)
    const previousFetch = globalThis.fetch
    context.after(() => { globalThis.fetch = previousFetch })
    let sent
    globalThis.fetch = async (url, options) => {
        sent = { options, url }
        const response = { json: async () => ({ access_token: 'renewed', expires_in: 60, refresh_token: 'next' }) }
        return response
    }
    const { default: refresh } = await import('./refreshAccessToken.jsx')
    const token = await refresh({ refresh_token: 'previous' }, { get: key => key }, new URL('https://refresh.example'))
    assert.equal(sent.options.body.get('refresh_token'), 'previous')
    assert.equal(sent.options.body.get('grant_type'), 'refresh_token')
    assert.equal(token.access_token, 'renewed')
    assert.equal(token.refresh_token, 'next')
    assert.ok(token.expires_at > Date.now() / 1000)
})
