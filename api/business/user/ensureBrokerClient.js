import { randomBytes } from 'crypto'
import { clientError } from 'core'
import { createTenantIamOptions } from '../tenantIamOptions.js'
import {
    iamGet,
    iamPost,
} from '../iam.js'

export default async ({
    clientId,
    redirectUri,
    sourceTenant,
}) => {
    const options = createTenantIamOptions(sourceTenant)
    const findClient = async () => {
        const clients = await iamGet(`clients?clientId=${clientId}`, options)
        return clients.find(item => item.clientId === clientId)
    }
    let client = await findClient()
    if (!client) {
        try {
            await iamPost('clients', {
                attributes: { supportBrokerRedirect: redirectUri },
                clientId,
                directAccessGrantsEnabled: false,
                enabled: true,
                fullScopeAllowed: false,
                protocol: 'openid-connect',
                publicClient: false,
                redirectUris: [redirectUri],
                secret: randomBytes(32).toString('hex'),
                serviceAccountsEnabled: false,
                standardFlowEnabled: true,
            }, options)
        }
        catch (e) {
            if (!await findClient()) throw e
        }
        client = await findClient()
    }
    if (!client?.enabled || client.publicClient || !client.standardFlowEnabled ||
        client.attributes?.supportBrokerRedirect !== redirectUri ||
        client.redirectUris?.length !== 1 || client.redirectUris[0] !== redirectUri) {
        clientError('invalidRequest')
    }
    const credentials = await iamGet(`clients/${client.id}/client-secret`, options)
    if (!credentials?.value) clientError('coreApiRoleAccessFailed')
    return credentials.value
}
