import { dbItem } from 'core'
import { iamGet } from '../iam.js'

const normalizeRoles = roles => roles
    .filter(role => !/[-_]/.test(role.name))
    .map(role => ({
        id: role.id,
        name: role.name,
    }))

export const getRoles = async params => {
    const id = params.query?.id
    if (!id) {
        return normalizeRoles(await iamGet('roles', params))
    }
    const user = await dbItem({
        id,
        part: 'accounts',
        type: 'user',
    })
    if (!user?.uuid) {
        return []
    }
    return normalizeRoles(await iamGet(`users/${user.uuid}/role-mappings/realm`, params))
}
