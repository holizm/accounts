import { iamGet } from '../iam.js'

export const getRoleMembers = async (role, params) => {
    const users = []
    const pageSize = 100
    let first = 0
    while (true) {
        const page = await iamGet(`roles/${encodeURIComponent(role)}/users?first=${first}&max=${pageSize}`, params)
        users.push(...page)
        if (page.length < pageSize) break
        first += pageSize
    }
    return users
}
