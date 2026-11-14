import assert from 'assert/strict'
import { readFileSync } from 'fs'
import test from 'node:test'

test('the site sign-in event always delegates synchronization with its request context', () => {
    const source = readFileSync(new URL('./plugin.ts', import.meta.url), 'utf8')
    assert.ok(source.includes('await syncSignedInUser(message, { url })'))
    assert.ok(!source.includes('if (!profile?.sub) return'))
    assert.ok(source.includes('authorizeCredentials(credentials, { url })'))
})
