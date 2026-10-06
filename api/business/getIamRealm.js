import {
    getTenant,
    providers,
    serverError,
    settings,
} from 'core'
import { getTenantIamConfiguration } from './tenantIamOptions.js'
import getAccountsBaseUrl from './getAccountsBaseUrl.js'

export default params => {
    const tenant = getTenantIamConfiguration(params) || getTenant(params?.host || providers.host)
    const realm = tenant.realm
    const secrets = settings.production?.adminApi?.iamClientSecrets || []
    const tenantSettings = secrets.find(item => item.domain === tenant.prodDomain && item.realm === realm) ||
        secrets.find(item => item.domain === tenant.prodDomain && !item.realm)
    if (!tenantSettings?.secret) serverError('coreApiRoleAccessFailed')
    const configuration = {
        baseUrl: getAccountsBaseUrl(tenant),
        realm,
        tenantSettings,
    }
    return configuration
}
