export default async (path, request) => {
    const state = globalThis.accountAuthenticationState
    state.tenantRequests?.push(request)
    return state.tenant
}
