import post from 'post'

export default async (credentials, request) => {
    if (!credentials?.phone || !credentials?.otp) return null
    try {
        const result = await post('/accounts/signIn', {
            otp: credentials.otp,
            phone: credentials.phone,
        }, request)
        return result?.access_token ? result : null
    }
    catch (e) {
        return null
    }
}
