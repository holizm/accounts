import assert from 'assert/strict'
import test from 'node:test'
import provideEnvironment from '../testing/authenticationEnvironment.js'

test('missing and expired sessions redirect to automatic account sign-in', async context => {
    provideEnvironment(context)
    const { default: checkLogin } = await import('./checkLogin.jsx')
    const url = new URL('https://site.example/dashboard/profile')
    const redirect = (status, location) => Object.assign(new Error(), {
        location,
        status,
    })
    const event = {
        redirect,
        sharedMap: new Map(),
        url,
    }
    const expected = {
        location: '/accounts/sign-in/auto?providerId=keycloak&redirectTo=/dashboard/profile',
        status: 302,
    }

    assert.throws(() => checkLogin(event), expected)
    event.sharedMap.set('session', { expires: new Date(Date.now() - 60_000) })
    assert.throws(() => checkLogin(event), expected)
    event.sharedMap.set('session', { expires: new Date(Date.now() + 60_000) })
    assert.doesNotThrow(() => checkLogin(event))
})
