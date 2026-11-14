// @ts-nocheck
import { QwikAuth$ } from '@auth/qwik'
import type { Provider } from '@auth/auth/providers'
import Credentials from '@auth/qwik/providers/credentials'
import Keycloak from '@auth/qwik/providers/keycloak'
import authorizeCredentials from 'accountsAuthorizeCredentials'
import getAuthenticationParameters from 'accountsGetAuthenticationParameters'
import refreshAccessToken from 'accountsRefreshAccessToken'
import syncSignedInUser from 'accountsSyncSignedInUser'

export const {
    onRequest,
    useSession,
    useSignIn,
    useSignOut,
} = QwikAuth$(async ({
    env,
    url,
}) => {
    const params = await getAuthenticationParameters(env, url)
    const {
        accountsClient,
        accountsRealm,
        accountsUrl,
        authSecret,
        iamClientSecret,
        siteUrl,
    } = params

    const idpSignoutUrl = `${accountsUrl}/realms/${accountsRealm}/protocol/openid-connect/logout?redirect_uri=${siteUrl}`

    const config = {
        secret: authSecret,
        trustHost: true,
        pages: { signIn: '/accounts/sign-in' },
        events: {
            async signOut(message) {
                await fetch(idpSignoutUrl)
            },
            async signIn(message) {
                await syncSignedInUser(message, { url })
            },
        },
        callbacks: {
            async jwt({ token, account, profile, user }) {
                const nowTimeStamp = Math.floor(Date.now() / 1000)
                if (account?.provider === 'credentials') {
                    token.access_token = user.access_token
                    token.id_token = user.id_token
                    token.expires_at = nowTimeStamp + user.expires_in
                    token.refresh_token = user.refresh_token
                    token.userUuid = user.id
                } else if (account) {
                    token.access_token = account.access_token
                    token.id_token = account.id_token
                    token.expires_at = account.expires_at
                    token.refresh_token = account.refresh_token
                    token.userUuid = profile.sub
                } else {
                    if (token.expires_at && nowTimeStamp > token.expires_at) {
                        const result = await refreshAccessToken(token, env, url)
                        if (!result.access_token) {
                            return null
                        }
                        token.access_token = result?.access_token
                        token.id_token = result?.id_token ?? token.id_token
                        token.expires_at = result?.expires_at
                        token.refresh_token = result?.refresh_token
                    }
                }
                return token
            },
            async session({ session, token }) {
                if (!token.access_token) {
                    return null
                }
                session.user.id = token.userUuid
                session.user.accessToken = token.access_token
                session.user.idToken = token.id_token
                return session
            },
        },
        providers: [
            Credentials({
                credentials: {
                    phone: {},
                    otp: {},
                },
                async authorize(credentials) {
                    return await authorizeCredentials(credentials, { url })
                },
            }),
            Keycloak({
                clientId: accountsClient,
                clientSecret: iamClientSecret as string,
                issuer: `${accountsUrl}/realms/${accountsRealm}` as string,
            }),
        ] as Provider[],
    }
    return config
})
