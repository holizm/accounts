import { createHash } from 'crypto'
import { clientError } from 'core'
import { createTenantIamOptions } from '../tenantIamOptions.js'
import {
    iamGet,
    iamPost,
} from '../iam.js'
import ensureRealmBroker from './ensureRealmBroker.js'

export const ensureRoleAccessUser = async ({
    identity,
    sourceTenant,
    tenantConfiguration,
}) => {
    const sourceOptions = createTenantIamOptions(sourceTenant)
    const targetOptions = createTenantIamOptions(tenantConfiguration)
    const sourceUser = await iamGet(`users/${encodeURIComponent(identity.uuid)}`, sourceOptions)
    if (!sourceUser?.enabled || sourceUser.id !== identity.uuid) clientError('userIdentityFetchFailed')
    const sameRealm = sourceTenant.realm === tenantConfiguration.realm &&
        sourceTenant.accountsOrigin === tenantConfiguration.accountsOrigin
    if (sameRealm) {
        const account = { uuid: sourceUser.id }
        return account
    }
    const sourceIssuer = `${sourceTenant.accountsOrigin}/realms/${sourceTenant.realm}`
    const identityProvider = await ensureRealmBroker({
        sourceTenant,
        tenantConfiguration,
    })
    const digest = createHash('sha256').update(`${sourceIssuer}/${sourceUser.id}`).digest('hex').slice(0, 24)
    const username = `support${digest}`
    const findUser = async () => {
        const users = await iamGet(`users?username=${username}&exact=true`, targetOptions)
        return users?.[0]
    }
    let user = await findUser()
    if (!user) {
        const profile = {
            email: sourceUser.email,
            emailVerified: sourceUser.emailVerified === true,
            enabled: true,
            federatedIdentities: [{
                identityProvider,
                userId: sourceUser.id,
                userName: sourceUser.username,
            }],
            firstName: sourceUser.firstName,
            lastName: sourceUser.lastName,
            username,
        }
        try {
            await iamPost('users', profile, targetOptions)
        }
        catch (e) {
            if (!await findUser()) throw e
        }
        user = await findUser()
    }
    if (!user?.enabled) clientError('iamUserCreationFailed')
    const links = await iamGet(`users/${user.id}/federated-identity`, targetOptions)
    if (!links.some(link => link.identityProvider === identityProvider && link.userId === sourceUser.id)) {
        clientError('userIdentityFetchFailed')
    }
    const account = {
        identityProvider,
        uuid: user.id,
    }
    return account
}
