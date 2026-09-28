import {
    ensure,
    getByFilter,
    notFound,
    providers,
} from 'core'

export const getUser = async requestedUserUuid => {
    const uuid = providers.user || requestedUserUuid
    ensure(uuid).isSomething('invalidRequest')
    const user = await getByFilter(
        {
            part: 'accounts',
            type: 'user',
        },
        { uuid: uuid }
    )
    if (!user) {
        notFound()
    }
    return user
}
