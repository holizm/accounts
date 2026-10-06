import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
import { createTenantIamOptions } from './tenantIamOptions.js'

const calls = []
const settings = {
    iam: { '192.0.2.1': 'automationTestSecret' },
    production: { adminApi: { iamClientSecrets: [] } },
}
mock.module('dns/promises', {
    exports: { lookup: async () => [{ address: '192.0.2.1' }] },
})
mock.module('core', {
    exports: {
        getTenant: () => null,
        httpForm: async (url, form) => {
            calls.push({
                form,
                url,
            })
            const response = { responseJson: {
                access_token: `testToken${calls.length}`,
                expires_in: 60,
            } }
            return response
        },
        providers: {},
        serverError: code => { throw new Error(code) },
        settings,
    },
})
const { default: getAdminToken } = await import('./getAdminToken.js')

test('automation token uses master and tenant credential changes invalidate the cache', async () => {
    const options = createTenantIamOptions({
        accountsOrigin: 'https://accounts.example.com',
        prodDomain: 'example.com',
        realm: 'targetRealm',
    })
    await getAdminToken(options)
    await getAdminToken(options)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].url, 'https://accounts.example.com/realms/master/protocol/openid-connect/token')
    assert.equal(calls[0].form.client_id, 'automation')
    settings.production.adminApi.iamClientSecrets.push({
        domain: 'example.com',
        secret: 'tenantTestSecret',
    })
    await getAdminToken(options)
    assert.equal(calls[1].url, 'https://accounts.example.com/realms/targetRealm/protocol/openid-connect/token')
    assert.equal(calls[1].form.client_id, 'adminApi')
    settings.production.adminApi.iamClientSecrets[0].secret = 'rotatedTestSecret'
    await getAdminToken(options)
    assert.equal(calls.length, 3)
})
