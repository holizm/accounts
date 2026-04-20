import {
    getTenant,
    httpDelete,
    httpForm,
    httpGet,
    httpPost,
    httpPut,
    settings,
} from 'core'

const baseUrl = settings.accounts.url.replace(/\/$/, '')

const tokenCache = {}

const getRealm = params => {
    const tenant = getTenant(params.host)
    const tenantSettings = settings.
        production?.
        adminApi?.
        keycloakClientSecrets?.
        find(
            i => i.domain === tenant.prodDomain
        )
    if (!tenantSettings) throw `Missing Keycloak client secret for tenant ${tenant.prodDomain}`
    return {
        realm: tenant.id,
        tenant,
        tenantSettings,
    }
}

export const getAdminToken = async params => {
    const {
        realm,
        tenant,
        tenantSettings,
    } = getRealm(params)
    const now = Date.now()
    const tenantKey = tenant.id

    const cached = tokenCache[tenantKey]
    if (cached && cached.accessToken && cached.expiresAt > now + 1000) {
        return cached.accessToken
    }

    const url = `${baseUrl}/realms/${realm}/protocol/openid-connect/token`
    const form = {
        grant_type: 'client_credentials',
        client_id: 'AdminApi',
        client_secret: tenantSettings.secret,
    }

    const { responseJson } = await httpForm(url, form)
    const expiresIn = responseJson.expires_in || 300

    tokenCache[tenantKey] = {
        accessToken: responseJson.access_token,
        expiresAt: Date.now() + (expiresIn - 30) * 1000,
    }

    return tokenCache[tenantKey].accessToken
}

const kcApi = async (method, path, data, options) => {
    const token = await getAdminToken(options)
    const { realm } = getRealm(options)
    const url = `${baseUrl}/admin/realms/${realm}/${path}`

    options = options || {}
    options.headers = { Authorization: `Bearer ${token}` }

    switch (method) {
        case 'GET': return httpGet(url, options)
        case 'POST': return httpPost(url, data, options)
        case 'PUT': return httpPut(url, data, options)
        case 'DELETE': return httpDelete(url, data, options)
        default: throw `Unsupported method: ${method}`
    }
}

export const kcGet = (path, options) => kcApi('GET', path, null, options)
export const kcPost = (path, data, options) => kcApi('POST', path, data, options)
export const kcPut = (path, data, options) => kcApi('PUT', path, data, options)
export const kcDelete = (path, data, options) => kcApi('DELETE', path, data, options)
