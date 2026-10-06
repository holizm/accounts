import {
    clientError,
    httpDelete,
    httpForm,
    httpGet,
    httpPost,
    httpPut,
    warning,
} from 'core'
import getIamRealm from './getIamRealm.js'

const tokenCache = {}
const realmValidationCache = {}

export const getAdminToken = async params => {
    const {
        baseUrl,
        realm,
        tenantSettings,
    } = getIamRealm(params)
    const now = Date.now()
    const tenantKey = `${baseUrl}/realms/${realm}`

    const cached = tokenCache[tenantKey]
    if (cached && cached.accessToken && cached.expiresAt > now + 1000) {
        return cached.accessToken
    }

    const url = `${baseUrl}/realms/${realm}/protocol/openid-connect/token`
    const form = {
        grant_type: 'client_credentials',
        client_id: 'adminApi',
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

const verifyRealmOnce = async params => {
    const {
        baseUrl,
        realm,
    } = getIamRealm(params)
    const cacheKey = `${baseUrl}/realms/${realm}`
    if (realmValidationCache[cacheKey]) {
        return
    }
    const url = `${baseUrl}/admin/realms/${realm}`
    const { responseJson } = await httpGet(url, {
        headers: {
            Authorization: `Bearer ${await getAdminToken(params)}`
        }
    })
    const actualRealm = responseJson?.realm
    if (actualRealm !== realm) {
        warning(`Invalid realm name. Expected ${realm}, got ${actualRealm}`)
        warning(`Response was:`, responseJson)
        clientError('invalidRealmName')
    }
    realmValidationCache[cacheKey] = true
}

const iamApi = async (method, path, data, options) => {
    const token = await getAdminToken(options)
    await verifyRealmOnce(options)
    const {
        baseUrl,
        realm,
    } = getIamRealm(options)
    const url = `${baseUrl}/admin/realms/${realm}/${path}`
    options = options || {}
    options.headers = { Authorization: `Bearer ${token}`, ...options.headers }
    let res
    switch (method) {
        case 'get':
            res = await httpGet(url, options)
            break
        case 'post':
            res = await httpPost(url, data, options)
            break
        case 'put':
            res = await httpPut(url, data, options)
            break
        case 'delete':
            res = await httpDelete(url, data, options)
            break
        default:
            throw `Unsupported method: ${method}`
    }
    return res.responseJson
}

export const iamGet = (path, options) => iamApi('get', path, null, options)
export const iamPost = (path, data, options) => iamApi('post', path, data, options)
export const iamPut = (path, data, options) => iamApi('put', path, data, options)
export const iamDelete = (path, data, options) => iamApi('delete', path, data, options)
