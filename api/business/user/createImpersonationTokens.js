import {
    createHash,
    randomBytes,
} from 'crypto'
import {
    httpForm,
    httpGet,
    httpPost,
    serverError,
} from 'core'
import getAdminToken from '../getAdminToken.js'
import getIamRealm from '../getIamRealm.js'
import { createTenantIamOptions } from '../tenantIamOptions.js'

export const createImpersonationTokens = async ({
    client,
    panelUrl,
    tenantConfiguration,
    uuid,
}) => {
    const options = createTenantIamOptions(tenantConfiguration)
    const {
        baseUrl,
        realm,
    } = await getIamRealm(options)
    const impersonation = await httpPost(`${baseUrl}/admin/realms/${realm}/users/${encodeURIComponent(uuid)}/impersonation`, {}, {
        headers: { Authorization: `Bearer ${await getAdminToken(options)}` },
    })
    if (impersonation.responseStatus !== 200) serverError('coreApiRoleAccessFailed')
    const cookies = impersonation.responseHeaders?.['set-cookie']
    if (!Array.isArray(cookies) || !cookies.length) serverError('coreApiRoleAccessFailed')
    const verifier = randomBytes(32).toString('base64url')
    const state = randomBytes(32).toString('base64url')
    const redirect = new URL('/', panelUrl).href
    const authorizationUrl = new URL(`${baseUrl}/realms/${realm}/protocol/openid-connect/auth`)
    const query = {
        client_id: client,
        code_challenge: createHash('sha256').update(verifier).digest('base64url'),
        code_challenge_method: 'S256',
        prompt: 'none',
        redirect_uri: redirect,
        response_type: 'code',
        scope: 'openid',
        state,
    }
    for (const [key, value] of Object.entries(query)) authorizationUrl.searchParams.set(key, value)
    const authorization = await httpGet(authorizationUrl.href, {
        headers: { Cookie: cookies.map(cookie => cookie.split(';')[0]).join('; ') },
    })
    const location = authorization.responseHeaders?.location
    if (authorization.responseStatus !== 302 || !location) serverError('coreApiRoleAccessFailed')
    const callback = new URL(location)
    const code = callback.searchParams.get('code')
    if (!code || callback.origin !== new URL(redirect).origin || callback.searchParams.get('state') !== state) serverError('coreApiRoleAccessFailed')
    const response = await httpForm(`${baseUrl}/realms/${realm}/protocol/openid-connect/token`, {
        client_id: client,
        code,
        code_verifier: verifier,
        grant_type: 'authorization_code',
        redirect_uri: redirect,
    })
    if (response.responseStatus !== 200 || !response.responseJson?.access_token || !response.responseJson?.refresh_token) serverError('coreApiRoleAccessFailed')
    const tokens = {
        idToken: response.responseJson.id_token,
        refreshToken: response.responseJson.refresh_token,
        token: response.responseJson.access_token,
    }
    return tokens
}
