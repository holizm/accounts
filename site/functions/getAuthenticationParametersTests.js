import assert from 'assert/strict'
import test from 'node:test'
import getAuthenticationParameters from './getAuthenticationParameters.jsx'

test('authentication preserves request context and isolates file-preview parameters from ordinary requests', async context => {
    const previous = globalThis.settings
    context.after(() => {
        globalThis.settings = previous
        delete globalThis.authenticationRequestCalls
    })
    globalThis.settings = { themeContentSource: 'local' }
    globalThis.authenticationRequestCalls = []
    const env = { get: () => undefined }
    const preview = new URL('https://preview.example/?theme=core205&tenant=arena')
    const ordinary = new URL('https://preview.example/')
    const otherPreview = new URL('https://preview.example/?theme=core203&tenant=rainforesttrust')
    const first = await getAuthenticationParameters(env, preview)
    assert.equal(first.accountsRealm, 'preview')
    assert.equal(await getAuthenticationParameters(env, preview), first)
    const normal = await getAuthenticationParameters(env, ordinary)
    assert.equal(normal.accountsRealm, 'runtime')
    await getAuthenticationParameters(env, otherPreview)
    assert.deepEqual(globalThis.authenticationRequestCalls, [preview, ordinary, otherPreview])
})
