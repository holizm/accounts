export default event => {
    const session = event.sharedMap.get('session')
    if (!session || new Date(session.expires) < new Date()) {
        throw event.redirect(302, `/signin/auto?providerId=keycloak&redirectTo=${event.url.pathname}`);
    }
}
