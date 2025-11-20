import {
    clientError,
    getTenant,
    ok,
    pascalize,
    settings,
} from 'core'
import {
    kcDelete,
    kcGet,
    kcPost,
    kcPut,
} from "../keycloak.js"

const getRedirectUrls = ({
    baseDomain,
    baseName,
    isApi,
    isSite,
}) => {
    if (isSite) return [`https://${baseDomain}/*`]
    if (isApi && baseName === "Site") return [`https://api.${baseDomain}/*`]
    if (isApi) return [`https://api.${baseName}.${baseDomain}/*`]
    return [`https://${baseName}.${baseDomain}/*`]
}

const getClientNames = tenant => {
    const baseClients = [
        "AdminApi",
        "AdminPanel",
        "Site",
        "SiteApi",
    ]
    if (tenant.roles?.length) {
        tenant.roles.forEach(role => {
            const roleCapitalized = role.charAt(0).toUpperCase() + role.slice(1)
            baseClients.push(`${roleCapitalized}Panel`, `${roleCapitalized}Api`)
        })
    }
    return baseClients
}

const buildClientConfig = (name, baseDomain) => {
    const isApi = name.endsWith("Api")
    const isPanel = name.endsWith("Panel")
    const isSite = name === "Site"
    const baseName = name.replace(/Api$/, "").replace(/Panel$/, "").toLowerCase()
    const client = {
        clientId: name,
        publicClient: isPanel,
        serviceAccountsEnabled: name === "AdminApi",
        standardFlowEnabled: !isApi,
        directAccessGrantsEnabled: isApi,
        redirectUris: getRedirectUrls({
            baseDomain,
            baseName,
            isApi,
            isSite,
        }),
    }
    client.webOrigins = client.redirectUris.map(i => i.replace("/*", ""))
    return client
}

const needsUpdate = (existing, desired) => {
    for (let key in desired) {
        if (Array.isArray(desired[key]) && Array.isArray(existing[key])) {
            if (desired[key].join(",") !== existing[key].join(",")) return true
        }
        else if (existing[key] !== desired[key]) return true
    }
    return false
}

const addMapperToClient = async (params, clientUuid, clientId) => {
    const realmRoleMapper = {
        name: "roles",
        protocol: "openid-connect",
        protocolMapper: "oidc-usermodel-realm-role-mapper",
        consentRequired: false,
        config: {
            "access.token.claim": "true",
            "claim.name": "roles",
            "id.token.claim": "true",
            "introspection.token.claim": "true",
            "jsonType.label": "String",
            "lightweight.claim": "true",
            "multivalued": "true",
            "userinfo.token.claim": "true",
        }
    }

    const existingMappers = await kcGet(`clients/${clientUuid}/protocol-mappers/models`, {
        ...params,
        onFailed: () => []
    })

    const hasRolesMapper = existingMappers?.some(m => m.name === "roles")
    if (!hasRolesMapper) {
        await kcPost(`clients/${clientUuid}/protocol-mappers/models`, realmRoleMapper, {
            ...params,
            onFailed: () => null
        })
        console.log("Added realm role mapper to client:", clientId)
    }
}

const createOrUpdateClients = async (params, clients, existingClients) => {
    for (let client of clients) {
        const existing = existingClients.find(x => x.clientId === client.clientId)
        if (!existing) {
            const created = await kcPost(`clients`, client, params)
            console.log("Created client:", client.clientId)
            await addMapperToClient(params, created.id, client.clientId)
        }
        else if (needsUpdate(existing, client)) {
            await kcPut(`clients/${existing.id}`, client, params)
            console.log("Updated client:", client.clientId)
            await addMapperToClient(params, existing.id, client.clientId)
        }
        else {
            console.log("Client exists:", client.clientId)
            await addMapperToClient(params, existing.id, client.clientId)
        }
    }
}

const createOrUpdateRealmRoles = async (params, tenant) => {
    const realmRoles = ["Admin", "SuperAdmin"]

    if (tenant.roles?.length) {
        tenant.roles.forEach(role => {
            realmRoles.push(pascalize(role))
        })
    }

    const existingRoles = await kcGet(`roles`, params)

    for (let roleName of realmRoles) {
        const exists = existingRoles.some(r => r.name === roleName)
        if (!exists) {
            await kcPost(`roles`, { name: roleName }, params)
            console.log("Created realm role:", roleName)
        } else {
            console.log("Realm role exists:", roleName)
        }
    }

    for (let role of existingRoles) {
        if (
            /^[A-Z]/.test(role.name) &&
            !realmRoles.includes(role.name)
        ) {
            await kcDelete(`roles/${encodeURIComponent(role.name)}`, null, params)
            console.log("Deleted realm role:", role.name)
        }
    }
}

export default async params => {
    if (!settings.isDeveloping) clientError("NotAvailableInProduction")
    const tenant = getTenant(params.host)
    await createOrUpdateRealmRoles(params, tenant)
    const existingClients = await kcGet(`clients`, params)
    const baseDomain = tenant.prodDomain
    const clientNames = getClientNames(tenant)
    const clients = clientNames.map(name => buildClientConfig(name, baseDomain))
    await createOrUpdateClients(params, clients, existingClients)
    const updatedClients = await kcGet(`clients`, params)
    return ok({ data: updatedClients })
}
