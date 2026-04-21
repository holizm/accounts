import {
    camelize,
    clientError,
    getTenant,
    info,
    ok,
    settings,
    success,
    warning,
} from 'core'
import {
    kcDelete,
    kcGet,
    kcPost,
    kcPut,
} from '../keycloak.js'

const getRedirectUrls = ({
    baseDomain,
    baseName,
    isApi,
    isSite,
}) => {
    if (isSite) return [`https://${baseDomain}/*`]
    if (isApi && baseName === 'site') return [`https://api.${baseDomain}/*`]
    if (isApi) return [`https://api.${baseName}.${baseDomain}/*`]
    return [`https://${baseName}.${baseDomain}/*`]
}

const getClientNames = tenant => {
    const baseClients = [
        'adminApi',
        'adminPanel',
        'site',
        'siteApi',
    ]
    const allClients = [...baseClients]
    if (tenant.roles?.length) {
        tenant.roles.forEach(role => {
            const camelizedRole = camelize(role)
            allClients.push(`${camelizedRole}Api`)
            allClients.push(`${camelizedRole}Panel`)
        })
    }
    return allClients
}

const buildClientConfig = (name, baseDomain) => {
    const isApi = name.endsWith('Api')
    const isPanel = name.endsWith('Panel')
    const isSite = name === 'site'
    const baseName = name.replace(/Api$/, '').replace(/Panel$/, '').toLowerCase()
    const client = {
        clientId: name,
        publicClient: isPanel,
        serviceAccountsEnabled: name === 'adminApi',
        standardFlowEnabled: !isApi,
        directAccessGrantsEnabled: isApi,
        redirectUris: getRedirectUrls({
            baseDomain,
            baseName,
            isApi,
            isSite,
        }),
    }
    client.webOrigins = client.redirectUris.map(i => i.replace('/*', ''))
    return client
}

const needsUpdate = (existing, desired) => {
    for (let key in desired) {
        if (Array.isArray(desired[key]) && Array.isArray(existing[key])) {
            if (desired[key].join(',') !== existing[key].join(',')) return true
        }
        else if (existing[key] !== desired[key]) return true
    }
    return false
}

const addMapperToClient = async (params, clientUuid, clientId) => {
    const realmRoleMapper = {
        name: 'roles',
        protocol: 'openid-connect',
        protocolMapper: 'oidc-usermodel-realm-role-mapper',
        consentRequired: false,
        config: {
            'access.token.claim': 'true',
            'claim.name': 'roles',
            'id.token.claim': 'true',
            'introspection.token.claim': 'true',
            'jsonType.label': 'String',
            'lightweight.claim': 'true',
            'multivalued': 'true',
            'userinfo.token.claim': 'true',
        }
    }

    const existingMappers = await kcGet(`clients/${clientUuid}/protocol-mappers/models`, {
        ...params,
        onFailed: () => []
    })

    const hasRolesMapper = existingMappers?.some(m => m.name === 'roles')
    if (!hasRolesMapper) {
        await kcPost(`clients/${clientUuid}/protocol-mappers/models`, realmRoleMapper, {
            ...params,
            onFailed: () => null
        })
        success('Added realm role mapper to client:', clientId)
    }
}

const createOrUpdateClients = async (params, clients, existingClients) => {
    const existingClientMap = new Map(
        existingClients.map(c => [c.clientId, c])
    )

    for (let client of clients) {
        const existing = existingClientMap.get(client.clientId)

        if (!existing) {
            const created = await kcPost(`clients`, client, params)
            success('Created client:', client.clientId)
            await addMapperToClient(params, created.id, client.clientId)
        } else if (needsUpdate(existing, client)) {
            await kcPut(`clients/${existing.id}`, client, params)
            success('Updated client:', client.clientId)
            await addMapperToClient(params, existing.id, client.clientId)
        } else {
            info('Client exists:', client.clientId)
            await addMapperToClient(params, existing.id, client.clientId)
        }
    }
}

const getTenantRoles = tenant => {
    const tenantRoles = ['admin', 'superAdmin']

    if (tenant.roles?.length) {
        tenant.roles.forEach(role => {
            tenantRoles.push(camelize(role))
        })
    }

    return tenantRoles
}

const upsertNewOrExistingRoles = async (tenantRoles, existingRoles, params) => {
    const existingRoleSet = new Set(existingRoles.map(r => r.name))

    for (let runnableRole of tenantRoles) {
        const exists = existingRoleSet.has(runnableRole)

        if (!exists) {
            await kcPost(`roles`, { name: runnableRole }, params)
            success('Created realm role:', runnableRole)
        } else {
            info('Realm role exists:', runnableRole)
        }
    }
}

const deleteNonExistingRoles = async (tenantRoles, existingRoles, params) => {
    const tenantRoleSet = new Set(tenantRoles)

    for (let existingRole of existingRoles) {
        const isSystemRole = /[-_]/.test(existingRole.name)

        if (!isSystemRole && !tenantRoleSet.has(existingRole.name)) {
            await kcDelete(`roles/${encodeURIComponent(existingRole.name)}`, null, params)
            warning('Deleted realm role:', existingRole.name)
        }
    }
}

const syncRealmRoles = async (params, tenant) => {
    const tenantRoles = getTenantRoles(tenant)
    const existingRoles = await kcGet(`roles`, params)

    await upsertNewOrExistingRoles(tenantRoles, existingRoles, params)
    await deleteNonExistingRoles(tenantRoles, existingRoles, params)
}

export default async params => {
    if (!settings.isDeveloping) clientError('notAvailableInProduction')
    const tenant = getTenant(params.host)
    await syncRealmRoles(params, tenant)
    const existingClients = await kcGet(`clients`, params)
    const baseDomain = tenant.prodDomain
    const clientNames = getClientNames(tenant)
    const clients = clientNames.map(name => buildClientConfig(name, baseDomain))
    await createOrUpdateClients(params, clients, existingClients)
    const updatedClients = await kcGet(`clients`, params)
    return ok({ data: updatedClients })
}
