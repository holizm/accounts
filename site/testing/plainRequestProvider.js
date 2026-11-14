export default async (url, body, request) => {
    const state = globalThis.accountAuthenticationState
    state.requests.push({
        body,
        request,
        url,
    })
    if (state.failure) throw state.failure
    return state.result
}
