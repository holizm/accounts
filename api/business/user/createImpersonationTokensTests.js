import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
let cookies = ['identity=session; HttpOnly', 'session=value; Secure']
let foreign = false
let form
mock.module('../getAdminToken.js', { defaultExport: async () => 'adminCredential' })
mock.module('../getIamRealm.js', { defaultExport: async () => {
    const configuration = {
        baseUrl: 'https://accounts.example.com',
        realm: 'target',
    }
    return configuration
} })
mock.module('core', { namedExports: {
    httpForm: async (url, value) => {
        form = value
        const response = {
            responseJson: {
                access_token: 'selectedAccess',
                id_token: 'selectedIdentity',
                refresh_token: 'selectedRefresh',
            },
            responseStatus: 200,
        }
        return response
    },
    httpGet: async url => {
        const request = new URL(url)
        assert.equal(request.searchParams.get('prompt'), 'none')
        assert.equal(request.searchParams.get('code_challenge_method'), 'S256')
        const callback = new URL(foreign ? 'https://foreign.example.com/' : 'https://maintenance.example.com/')
        callback.searchParams.set('state', request.searchParams.get('state'))
        callback.searchParams.set('code', 'authorizationCode')
        const response = {
            responseHeaders: { location: callback.href },
            responseStatus: 302,
        }
        return response
    },
    httpPost: async (url, body, options) => {
        assert.equal(options.headers.Authorization, 'Bearer adminCredential')
        const response = {
            responseHeaders: { 'set-cookie': cookies },
            responseStatus: 200,
        }
        return response
    },
    serverError: code => { throw new Error(code) },
} })
const { createImpersonationTokens } = await import('./createImpersonationTokens.js')
const request = {
    client: 'maintenancePanel',
    panelUrl: 'https://maintenance.example.com/?tenant=customer',
    tenantConfiguration: {},
    uuid: 'selectedUser',
}
test('impersonation exchanges a private IAM session and PKCE code for selected-user tokens', async () => {
    const result = await createImpersonationTokens(request)
    assert.equal(result.token, 'selectedAccess')
    assert.equal(result.refreshToken, 'selectedRefresh')
    assert.equal(form.redirect_uri, 'https://maintenance.example.com/')
    assert.equal(form.client_id, 'maintenancePanel')
    assert.equal(form.code_verifier.length, 43)
    assert.equal(form.grant_type, 'authorization_code')
})
test('missing IAM cookies and a redirect to another origin fail closed', async () => {
    const original = cookies
    cookies = []
    await assert.rejects(createImpersonationTokens(request), /coreApiRoleAccessFailed/)
    cookies = original
    foreign = true
    await assert.rejects(createImpersonationTokens(request), /coreApiRoleAccessFailed/)
    foreign = false
})
