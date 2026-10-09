import accountsUseSession from 'accountsUseSession'

export default session => {
    if (!session) {
        session = accountsUseSession()
    }
    const isSignedIn =
        session &&
        session.value &&
        session.value.expires &&
        new Date(session.value.expires) > new Date()

    return {
        isSignedIn: isSignedIn === true ? true : false,
        user: session?.value?.user
    }
}
