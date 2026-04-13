export default localePathPrefix => {
    if (localePathPrefix == undefined) {
        throw new Error('localePathPrefix was not provided')
    }
    return `${localePathPrefix}/dashboard`
}
