import { getRoles } from '../user/getRoles.js'

export const getRoleOptions = async params => {
    const roles = await getRoles({
        ...params,
        query: {},
    })
    const options = roles.sort((first, second) => first.name.localeCompare(second.name)).map(role => {
        const option = {
            id: role.name,
            title: role.name,
        }
        return option
    })
    return options
}
