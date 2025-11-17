import { getByFilter } from 'core'

export const getUserByUsername = async username => {
    const user = await getByFilter(
        {
            part: "Accounts",
            type: "User",
            doNotThrow: true,
        },
        {
            username: username
        }
    )
    return user
}
