import { mock } from 'node:test'

const settings = {
    isDeveloping: true,
    otpLength: 6,
    otpLifetimeInSeconds: 120,
}
const cache = mock.fn(async () => {})
const claimCache = mock.fn(async () => true)
const changePassword = mock.fn(async () => {})
const getUserByPhone = mock.fn(async () => ({ uuid: 'testUser' }))
const sendTextMessage = mock.fn(async () => {})
const fail = code => { throw new Error(code) }
mock.module('core', {
    exports: {
        cache,
        claimCache,
        clientError: fail,
        ensure: value => {
            const validation = {
                get and() { return validation },
                isPhone: code => {
                    if (value === 'invalid') fail(code)
                    return validation
                },
                isSomething: code => {
                    if (!value) fail(code)
                    return validation
                },
            }
            return validation
        },
        getTenant: () => ({ id: 'example' }),
        settings,
    },
})
mock.module('notifications', { exports: { sendTextMessage } })
mock.module('../user/getByPhone.js', { exports: { getUserByPhone } })
mock.module('../user/changePassword.js', { exports: { changePassword } })

export default {
    cache,
    changePassword,
    claimCache,
    getUserByPhone,
    sendTextMessage,
    settings,
}
