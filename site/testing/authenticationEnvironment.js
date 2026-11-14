import { readFileSync } from 'fs'
import { registerHooks } from 'module'

export default context => {
    const previousSettings = globalThis.settings
    const previousState = globalThis.accountAuthenticationState
    const state = {
        failure: null,
        privateSettings: {},
        requests: [],
        result: { access_token: 'credentialToken', id: 'user' },
        tenant: { accountsOrigin: 'https://iam.example', devDomain: 'shop.example', prodDomain: 'shop.example', realm: 'realm' },
    }
    globalThis.settings = {}
    globalThis.accountAuthenticationState = state
    const aliases = {
        accountsGetAuthenticationParameters: '../functions/getAuthenticationParameters.jsx',
        getFromCacheOrApi: './tenantResponseProvider.js',
        getTenant: './tenantConfigurationProvider.js',
        post: './plainRequestProvider.js',
        postWithAuthentication: '../../../site/core/postWithAuthentication.jsx',
        privateSettingsLoader: './privateSettingsProvider.js',
    }
    const hooks = registerHooks({
        load: (url, options, nextLoad) => {
            if (!url.endsWith('.jsx')) return nextLoad(url, options)
            const loaded = {
                format: 'module',
                shortCircuit: true,
                source: readFileSync(new URL(url), 'utf8'),
            }
            return loaded
        },
        resolve: (specifier, options, nextResolve) => {
            const target = specifier === './createAxiosInstance.jsx'
                ? './authenticationRequestProvider.js'
                : aliases[specifier]
            if (!target) return nextResolve(specifier, options)
            const resolved = {
                shortCircuit: true,
                url: new URL(target, import.meta.url).href,
            }
            return resolved
        },
    })
    context.after(() => {
        hooks.deregister()
        globalThis.settings = previousSettings
        globalThis.accountAuthenticationState = previousState
    })
    return state
}
