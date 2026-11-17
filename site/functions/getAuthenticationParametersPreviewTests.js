import assert from 'assert/strict'
import test from 'node:test'
import provideEnvironment from '../testing/authenticationEnvironment.js'

test('authentication preserves request context and isolates file-preview parameters from ordinary requests', async context => {
    const state = provideEnvironment(context)
    const { default: getParameters } = await import('./getAuthenticationParameters.jsx')
    globalThis.settings.themeContentSource = 'local'
    state.tenantRequests = []
    const env = { get: () => undefined }
    const preview = new URL('https://preview.example/?theme=core205&tenant=arena')
    const ordinary = new URL('https://preview.example/')
    const otherPreview = new URL('https://preview.example/?theme=core203&tenant=rainforesttrust')
    const first = await getParameters(env, preview)
    assert.equal(await getParameters(env, preview), first)
    const normal = await getParameters(env, ordinary)
    assert.notEqual(normal, first)
    await getParameters(env, otherPreview)
    assert.deepEqual(state.tenantRequests.map(request => request.url), [preview, ordinary, otherPreview])
})
