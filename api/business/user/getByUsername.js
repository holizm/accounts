import { getByFilter } from 'core'

export const getUserByUsername = async username => {
    const user = await getByFilter(
        {
            part: 'accounts',
            type: 'user',
        },
        {
            username: username
        }
    )
    return user
}
