import assert from 'assert/strict'
import test from 'node:test'
import getAccountsBaseUrl from './getAccountsBaseUrl.js'

test('a trailing slash does not change the accounts base URL', () => {
    const origin = 'https://accounts.example.com'
    assert.equal(getAccountsBaseUrl({ accountsOrigin: origin }), origin)
    assert.equal(getAccountsBaseUrl({ accountsOrigin: `${origin}/` }), origin)
})
