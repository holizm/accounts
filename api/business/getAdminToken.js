import { createHash } from 'crypto'
import {
    httpForm,
    serverError,
} from 'core'
import getIamRealm from './getIamRealm.js'

const tokenCache = {}

const getAdminToken = async (params, useAutomation = false) => {
    const {
        baseUrl,
        clientId,
        secret,
        tokenRealm,
    } = await getIamRealm(params, useAutomation)
    const now = Date.now()
    const credentialHash = createHash('sha256').update(secret).digest('hex')
    const tenantKey = `${baseUrl}/${tokenRealm}/${clientId}/${credentialHash}`

    const cached = tokenCache[tenantKey]
    if (cached && cached.accessToken && cached.expiresAt > now + 1000) {
        return cached.accessToken
    }

    const url = `${baseUrl}/realms/${tokenRealm}/protocol/openid-connect/token`
    const form = {
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: secret,
    }

    const {
        responseJson,
        responseStatus,
    } = await httpForm(url, form)
    if (!responseJson?.access_token) {
        const rejectedClient = responseStatus === 401 &&
            ['invalid_client', 'unauthorized_client'].includes(responseJson?.error)
        if (clientId === 'adminApi' && rejectedClient) return getAdminToken(params, true)
        serverError('coreApiRoleAccessFailed')
    }
    const expiresIn = responseJson.expires_in || 300

    tokenCache[tenantKey] = {
        accessToken: responseJson.access_token,
        expiresAt: Date.now() + (expiresIn - 30) * 1000,
    }

    return tokenCache[tenantKey].accessToken
}

export default getAdminToken
