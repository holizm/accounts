export default async request => {
    const client = {
        post: async (url, body, options) => {
            const state = globalThis.accountAuthenticationState
            state.requests.push({
                body,
                options,
                request,
                url,
            })
            if (state.failure) throw state.failure
            const response = { data: state.result }
            return response
        },
    }
    return client
}
