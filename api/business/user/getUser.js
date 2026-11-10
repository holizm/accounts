import {
    ensure,
    getByFilter,
    notFound,
    providers,
} from 'core'

export const getUser = async requestedUserUuid => {
    const uuid = providers.user || requestedUserUuid

    ensure(uuid).satisfies(value => typeof value === 'string' && value.length > 0, 'invalidRequest')
    const user = await getByFilter(
        {
            acrossLocales: true,
            part: 'accounts',
            type: 'user',
        },
        {
            tenant: providers.tenant,
            uuid,
        }
    )
    if (!user) {
        notFound()
    }
    return user
}
