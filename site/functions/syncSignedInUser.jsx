import postWithAuthentication from 'postWithAuthentication'

export default async (message, request) => {
    const accessToken = message.account?.access_token || message.user?.access_token
    const session = { user: { accessToken } }
    return await postWithAuthentication('/accounts/user/syncByUuid', {}, session, request)
}
