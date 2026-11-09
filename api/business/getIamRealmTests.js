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
const settings = {
    iam: { '192.0.2.1': 'automationTestSecret' },
    production: { adminApi: { iamClientSecrets: [{
        domain: 'example.com',
        secret: 'sourceTestSecret',
    }, {
        domain: 'example.com',
        realm: 'targetRealm',
        secret: 'targetTestSecret',
    }] } },
}
mock.module('dns/promises', {
    exports: { lookup: async () => [{ address: '192.0.2.1' }] },
})
mock.module('core', {
    exports: {
        getTenant: () => sourceTenant,
        providers: { host: 'api.control.example.com' },
        serverError: code => { throw new Error(code) },
        settings,
    },
})
const { default: getIamRealm } = await import('./getIamRealm.js')

test('HTTP properties cannot redirect IAM credentials to another server', async () => {
    const configuration = await getIamRealm({ tenantConfiguration: {
        accountsOrigin: 'https://attacker.example.com',
        prodDomain: 'example.com',
        realm: 'targetRealm',
    } })
    assert.equal(configuration.baseUrl, sourceTenant.accountsOrigin)
    assert.equal(configuration.realm, sourceTenant.realm)
})

test('internal tenant options select the configured realm and its own secret', async () => {
    const tenantConfiguration = {
        ...sourceTenant,
        realm: 'targetRealm',
    }
    const configuration = await getIamRealm(createTenantIamOptions(tenantConfiguration))
    assert.equal(configuration.realm, 'targetRealm')
    assert.equal(configuration.tenantSettings.secret, 'targetTestSecret')
    assert.equal(configuration.clientId, 'adminApi')
    assert.equal(configuration.tokenRealm, 'targetRealm')
})

test('missing tenant credentials use automation without changing the target realm', async () => {
    const target = {
        ...sourceTenant,
        prodDomain: 'other.example.com',
        realm: 'otherRealm',
    }
    const configuration = await getIamRealm(createTenantIamOptions(target))
    assert.equal(configuration.clientId, 'automation')
    assert.equal(configuration.tokenRealm, 'master')
    assert.equal(configuration.realm, 'otherRealm')
    assert.equal(configuration.secret, 'automationTestSecret')
})

test('missing both credentials fails instead of using another accounts server', async () => {
    const secret = settings.iam['192.0.2.1']
    delete settings.iam['192.0.2.1']
    try {
        await assert.rejects(getIamRealm(createTenantIamOptions({
            ...sourceTenant,
            prodDomain: 'unconfigured.example.com',
        })), /coreApiRoleAccessFailed/)
    }
    finally {
        settings.iam['192.0.2.1'] = secret
    }
})
