import getFromCacheOrApi from 'getFromCacheOrApi'
import getTenant from 'getTenant'

const paramsCache = {}

export default async (env, url) => {
    const host = url.hostname
    const cacheKey = globalThis.settings?.themeContentSource === 'local' && url.searchParams.has('theme') ? url.href : host
    if (paramsCache[cacheKey]) {
        return paramsCache[cacheKey]
    }
    const tenant = getTenant(host)
    const currentTenant = await getFromCacheOrApi('/tenant', { url })
    const accountsUrl = currentTenant?.accountsOrigin
    const accountsRealm = currentTenant?.realm || 'dev'
    const iamClientSecret = globalThis.settings.iamClientSecret || env.get('iamClientSecret')
    const authSecret = globalThis.settings.authSecret || env.get('authSecret')
    const siteUrl = currentTenant?.prodDomain || currentTenant?.devDomain
    const accountsClient = globalThis.settings.accounts?.client ?? 'site'

    const params = {
        accountsClient,
        accountsRealm,
        accountsUrl,
        authSecret,
        host,
        iamClientSecret,
        siteUrl
    }

    const { default: loadPrivateSettings } = await import('privateSettingsLoader')
    const privateSettings = await loadPrivateSettings()
    const tenantSettings = privateSettings?.iamClientSecrets?.find(
        i => i.domain === tenant.prodDomain
    )
    if (privateSettings.authSecret) {
        params.authSecret = privateSettings.authSecret
    }

    if (tenantSettings) {
        params.iamClientSecret = tenantSettings.secret
    }
    paramsCache[cacheKey] = params
    return params
}
