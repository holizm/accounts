import post from 'post'

export default session => {
    return post('user/syncByUuid', {
        'userUuid': session?.value?.user?.id
    })
}
