import { createHash } from 'crypto'
import { clientError } from 'core'
import { createTenantIamOptions } from '../tenantIamOptions.js'
import {
    iamGet,
    iamPost,
} from '../iam.js'
import ensureBrokerClient from './ensureBrokerClient.js'
import ensureBrokerLoginFlow from './ensureBrokerLoginFlow.js'

const pending = new Map()

const configureBroker = async ({
    sourceTenant,
    tenantConfiguration,
}) => {
    const options = createTenantIamOptions(tenantConfiguration)
    const sourceIssuer = `${sourceTenant.accountsOrigin}/realms/${sourceTenant.realm}`
    const targetIssuer = `${tenantConfiguration.accountsOrigin}/realms/${tenantConfiguration.realm}`
    const digest = value => createHash('sha256').update(value).digest('hex').slice(0, 24)
    const alias = `control${digest(sourceIssuer)}`
    const findProvider = async () => {
        const providers = await iamGet('identity-provider/instances', options)
        return providers.find(item => item.alias === alias)
    }
    let provider = await findProvider()
    if (!provider) {
        const firstBrokerLoginFlowAlias = await ensureBrokerLoginFlow(options)
        const clientId = `support${digest(targetIssuer)}`
        const clientSecret = await ensureBrokerClient({
            clientId,
            redirectUri: `${targetIssuer}/broker/${alias}/endpoint`,
            sourceTenant,
        })
        try {
            await iamPost('identity-provider/instances', {
                alias,
                config: {
                    authorizationUrl: `${sourceIssuer}/protocol/openid-connect/auth`,
                    clientId,
                    clientSecret,
                    defaultScope: 'openid profile',
                    issuer: sourceIssuer,
                    jwksUrl: `${sourceIssuer}/protocol/openid-connect/certs`,
                    pkceEnabled: 'true',
                    pkceMethod: 'S256',
                    syncMode: 'IMPORT',
                    tokenUrl: `${sourceIssuer}/protocol/openid-connect/token`,
                    useJwksUrl: 'true',
                    userInfoUrl: `${sourceIssuer}/protocol/openid-connect/userinfo`,
                    validateSignature: 'true',
                },
                enabled: true,
                firstBrokerLoginFlowAlias,
                hideOnLogin: true,
                linkOnly: false,
                providerId: 'keycloak-oidc',
                trustEmail: false,
            }, options)
        }
        catch (e) {
            if (!await findProvider()) throw e
        }
        provider = await findProvider()
    }
    if (!provider?.enabled || provider.config?.issuer !== sourceIssuer ||
        provider.providerId !== 'keycloak-oidc' || provider.linkOnly ||
        provider.firstBrokerLoginFlowAlias !== 'supportAccessOnly') clientError('coreApiRoleAccessFailed')
    await ensureBrokerLoginFlow(options)
    return provider.alias
}

export default async params => {
    const key = `${params.sourceTenant.accountsOrigin}/${params.sourceTenant.realm}/${params.tenantConfiguration.accountsOrigin}/${params.tenantConfiguration.realm}`
    if (pending.has(key)) return await pending.get(key)
    const operation = configureBroker(params)
    pending.set(key, operation)
    try {
        return await operation
    }
    finally {
        pending.delete(key)
    }
}
