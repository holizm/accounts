import {
    clientError,
    httpDelete,
    httpGet,
    httpPost,
    httpPut,
    warning,
} from 'core'
import getAdminToken from './getAdminToken.js'
import getIamRealm from './getIamRealm.js'

const realmValidationCache = {}

const verifyRealmOnce = async params => {
    const {
        baseUrl,
        realm,
    } = await getIamRealm(params)
    const cacheKey = `${baseUrl}/realms/${realm}`
    if (realmValidationCache[cacheKey]) {
        return
    }
    const url = `${baseUrl}/admin/realms/${realm}`
    const { responseJson, ...rest } = await httpGet(url, {
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
    } = await getIamRealm(options)
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

export { getAdminToken }
