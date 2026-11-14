import getAuthenticationParameters from 'accountsGetAuthenticationParameters'

export default async (token, env, url) => {
    const {
        accountsClient,
        accountsRealm,
        accountsUrl,
        iamClientSecret,
    } = await getAuthenticationParameters(env, url)
    const tokenUrl = `${accountsUrl}/realms/${accountsRealm}/protocol/openid-connect/token`

    const resp = await fetch(tokenUrl, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: accountsClient,
            client_secret: iamClientSecret,
            grant_type: 'refresh_token',
            refresh_token: token.refresh_token,
        }),
        method: 'POST',
    })
    const refreshToken = await resp.json()
    const refreshedToken = {
        access_token: refreshToken.access_token,
        id_token: refreshToken.id_token,
        expires_at: Math.floor(Date.now() / 1000) + refreshToken.expires_in,
        refresh_token: refreshToken.refresh_token,
    }
    return refreshedToken
}
