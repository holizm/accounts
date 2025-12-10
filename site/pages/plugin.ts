// @ts-nocheck
import { QwikAuth$ } from "@auth/qwik";
import type { Provider } from "@auth/auth/providers"
import Keycloak from "@auth/qwik/providers/keycloak"
import {
    getTenant,
    pascalize,
    post,
} from "base";
import fs from "fs";
import path from "path";

const paramsCache: Record<string, any> = {};

const getParams = (env, url) => {
    const host = url.hostname;
    if (paramsCache[host]) {
        return paramsCache[host];
    }

    const tenant = getTenant(host);
    const accountsUrl = globalThis.settings.AccountsUrl || globalThis.settings.Accounts?.Url;
    const accountsRealm = globalThis.settings.AccountsRealm || globalThis.settings.Accounts?.Realm || "Development";
    const keycloakClientSecret = globalThis.settings.KeycloakClientSecret || env.get("KEYCLOAK_CLIENT_SECRET");
    const authSecret = globalThis.settings.AuthSecret || env.get("AUTH_SECRET");
    const siteUrl = globalThis.settings.SiteUrl;
    const accountsClient = globalThis.settings.AccountsClient ?? "Site";

    const params = {
        accountsClient,
        accountsRealm: pascalize(tenant.Id),
        accountsUrl,
        authSecret,
        host,
        keycloakClientSecret,
        siteUrl: tenant.ProdDomain,
    };

    let tenantSettings;
    if (globalThis.settings.IsDeveloping) {
        tenantSettings = globalThis.settings.Production?.Site?.KeycloakClientSecrets?.find(
            i => i.Domain === tenant.ProdDomain
        );
    } else {
        const filePath = path.resolve(process.cwd(), "PrivateSettings.json");
        console.log(filePath)
        const privateSettings = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        console.log(privateSettings)
        tenantSettings = privateSettings?.KeycloakClientSecrets?.find(
            i => i.Domain === tenant.ProdDomain
        );
    }
    if (tenantSettings) {
        params.keycloakClientSecret = tenantSettings.Secret;
    }

    paramsCache[host] = params;
    return params;
};

const refreshAccessToken = async (token, env, url) => {
    const {
        accountsRealm,
        accountsUrl,
        keycloakClientSecret,
        accountsClient
    } = getParams(env, url);
    const tokenUrl = `${accountsUrl}/realms/${accountsRealm}/protocol/openid-connect/token`;

    const resp = await fetch(tokenUrl, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: accountsClient,
            client_secret: keycloakClientSecret,
            grant_type: "refresh_token",
            refresh_token: token.refresh_token,
        }),
        method: "POST",
    });
    const refreshToken = await resp.json();
    return {
        access_token: refreshToken.access_token,
        id_token: refreshToken.id_token,
        expires_at: Math.floor(Date.now() / 1000) + refreshToken.expires_in,
        refresh_token: refreshToken.refresh_token,
    };
};

export const {
    onRequest,
    useSession,
    useSignIn,
    useSignOut,
} = QwikAuth$(({
    env,
    url,
}) => {
    const {
        accountsClient,
        accountsRealm,
        accountsUrl,
        authSecret,
        keycloakClientSecret,
        siteUrl,
    } = getParams(env, url);

    const idpSignoutUrl = `${accountsUrl}/realms/${accountsRealm}/protocol/openid-connect/logout?redirect_uri=${siteUrl}`;

    const config = {
        secret: authSecret,
        trustHost: true,
        events: {
            async signOut(message) {
                console.log(`Signout URL: ${idpSignoutUrl}`);
                await fetch(idpSignoutUrl);
            },
            async signIn({ profile }) {
                const userUuid = profile.sub;
                await post("/user/syncByGuid", {
                    userGuid: userUuid,
                }, { url });
                console.log(`syncByGuid`);
            },
        },
        callbacks: {
            async jwt({ token, account, profile }) {
                const nowTimeStamp = Math.floor(Date.now() / 1000);
                if (account) {
                    token.access_token = account.access_token;
                    token.id_token = profile.id_token;
                    token.expires_at = account.expires_at;
                    token.refresh_token = account.refresh_token;
                    token.userUUID = profile.sub;
                } else {
                    if (nowTimeStamp > token.expires_at) {
                        console.log("Getting Refresh Token .......");
                        const result = await refreshAccessToken(token, env, url);
                        console.log("Got refresh token:", result);
                        if (!result.access_token) {
                            return null;
                        }
                        token.access_token = result?.access_token;
                        token.expires_at = result?.expires_at;
                        token.refresh_token = result?.refresh_token;
                    }
                }
                return token;
            },
            async session({ session, token }) {
                if (!token.access_token) {
                    return null;
                }
                session.user.guid = token.userUUID;
                session.user.accessToken = token.access_token;
                return session;
            },
        },
        providers: [
            Keycloak({
                clientId: accountsClient,
                clientSecret: keycloakClientSecret as string,
                issuer: `${accountsUrl}/realms/${accountsRealm}` as string,
            }),
        ] as Provider[],
    };
    return config;
});
