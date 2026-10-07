import { lookup } from 'dns/promises'
import {
    getTenant,
    providers,
    serverError,
    settings,
} from 'core'
import { getTenantIamConfiguration } from './tenantIamOptions.js'
import getAccountsBaseUrl from './getAccountsBaseUrl.js'

export default async params => {
    const tenant = getTenantIamConfiguration(params) || getTenant(params?.host || providers.host)
    console.log(tenant)
    const realm = tenant.realm
    const secrets = settings.production?.adminApi?.iamClientSecrets || []
    const tenantSettings = secrets.find(item => item.domain === tenant.prodDomain && item.realm === realm) ||
        secrets.find(item => item.domain === tenant.prodDomain && !item.realm)
    const baseUrl = getAccountsBaseUrl(tenant)
    let secret = tenantSettings?.secret
    let clientId = 'adminApi'
    let tokenRealm = realm
    if (!secret) {
        const addresses = await lookup(new URL(baseUrl).hostname, { all: true })
        secret = addresses.map(address => settings.iam?.[address.address]).find(Boolean)
        if (!secret) serverError('coreApiRoleAccessFailed')
        clientId = 'automation'
        tokenRealm = 'master'
    }
    const configuration = {
        baseUrl,
        clientId,
        realm,
        secret,
        tenantSettings,
        tokenRealm,
    }
    console.log(configuration)

    return configuration
}
