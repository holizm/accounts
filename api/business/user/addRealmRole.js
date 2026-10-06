import { clientError } from 'core'
import { createTenantIamOptions } from '../tenantIamOptions.js'
import {
    iamGet,
    iamPost,
} from '../iam.js'

export const addRealmRole = async ({
    role,
    tenantConfiguration,
    uuid,
}) => {
    const options = createTenantIamOptions(tenantConfiguration)
    const realmRole = await iamGet(`roles/${encodeURIComponent(role)}`, options)
    if (realmRole?.name !== role) clientError('invalidRequest')
    const path = `users/${encodeURIComponent(uuid)}/role-mappings/realm`
    const assignedRoles = await iamGet(path, options)
    if (!assignedRoles.some(item => item.id === realmRole.id)) {
        await iamPost(path, [realmRole], options)
    }
    const verifiedRoles = await iamGet(path, options)
    if (!verifiedRoles.some(item => item.id === realmRole.id)) clientError('coreApiRoleAccessFailed')
    return uuid
}
