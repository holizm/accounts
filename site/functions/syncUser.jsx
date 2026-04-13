import { post } from 'core'

export default (session) => {
    return post('user/syncByUuid', {
        'userUuid': session?.value?.user?.id
    })
}
