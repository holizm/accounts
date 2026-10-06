import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
import { createTenantIamOptions } from './tenantIamOptions.js'

const sourceTenant = {
    accountsOrigin: 'https://accounts.example.com',
    prodDomain: 'example.com',
    realm: 'sourceRealm',
}
mock.module('core', {
    exports: {
        getTenant: () => sourceTenant,
        providers: { host: 'api.control.example.com' },
        serverError: code => { throw new Error(code) },
        settings: { production: { adminApi: { iamClientSecrets: [{
            domain: 'example.com',
            secret: 'sourceTestSecret',
        }, {
            domain: 'example.com',
            realm: 'targetRealm',
            secret: 'targetTestSecret',
        }] } } },
    },
})
const { default: getIamRealm } = await import('./getIamRealm.js')

test('HTTP properties cannot redirect IAM credentials to another server', () => {
    const configuration = getIamRealm({ tenantConfiguration: {
        accountsOrigin: 'https://attacker.example.com',
        prodDomain: 'example.com',
        realm: 'targetRealm',
    } })
    assert.equal(configuration.baseUrl, sourceTenant.accountsOrigin)
    assert.equal(configuration.realm, sourceTenant.realm)
})

test('internal tenant options select the configured realm and its own secret', () => {
    const tenantConfiguration = {
        ...sourceTenant,
        realm: 'targetRealm',
    }
    const configuration = getIamRealm(createTenantIamOptions(tenantConfiguration))
    assert.equal(configuration.realm, 'targetRealm')
    assert.equal(configuration.tenantSettings.secret, 'targetTestSecret')
})
