export default event => {
    const session = event.sharedMap.get('session')
    if (!session || new Date(session.expires) < new Date()) {
        throw event.redirect(302, `/accounts/sign-in/auto?providerId=keycloak&redirectTo=${event.url.pathname}`)
    }
}
