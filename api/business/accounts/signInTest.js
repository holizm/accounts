import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'

const entries = new Map()
const tenant = {
    accountsOrigin: 'https://accounts.example.com',
    id: 'example',
    prodDomain: 'example.com',
    realm: 'example',
}
const settings = {
    isDeveloping: true,
    otpLength: 6,
    production: { site: { iamClientSecrets: [{ domain: 'example.com', secret: 'testSecret' }] } },
}
let password
let messages = 0
const key = scope => JSON.stringify(scope)
const fail = code => { throw new Error(code) }

mock.module('core', {
    exports: {
        cache: async ({ data, ttlSeconds, ...scope }) => entries.set(key(scope), data),
        claimCache: async ({ data, ttlSeconds, ...scope }) => {
            if (entries.has(key(scope))) return false
            entries.set(key(scope), data)
            return true
        },
        clientError: fail,
        consumeFromCache: async scope => {
            const value = entries.get(key(scope))
            entries.delete(key(scope))
            return value
        },
        ensure: value => ({ isSomething: code => { if (!value) fail(code) } }),
        getTenant: () => tenant,
        httpForm: async (url, form) => {
            assert.equal(form.password, password)
            assert.equal(form.client_secret, 'testSecret')
            const response = { responseJson: {
                access_token: 'testAccessToken',
                expires_in: 300,
                refresh_token: 'testRefreshToken',
            } }
            return response
        },
        isPhone: () => true,
        settings,
    },
})
mock.module('notifications', {
    exports: { sendTextMessage: async () => { messages += 1 } },
})
mock.module('../user/getByPhone.js', {
    exports: { getUserByPhone: async () => ({ uuid: 'testUser' }) },
})
mock.module('../user/changePassword.js', {
    exports: { changePassword: async params => { password = params.password } },
})

const { sendOtp } = await import('./sendOtp.js')
const { signIn } = await import('./signIn.js')

test('development OTP signs in once without sending an SMS', async () => {
    const params = {
        body: { phone: '+15550001111' },
        host: 'api.example.local',
    }
    const sent = await sendOtp(params)
    assert.match(sent.otp, /^\d{6}$/)
    assert.equal(messages, 0)
    await assert.rejects(sendOtp(params), /invalidRequest/)
    const signedIn = await signIn({
        ...params,
        body: {
            ...params.body,
            otp: sent.otp,
        },
    })
    assert.equal(signedIn.access_token, 'testAccessToken')
    assert.equal(signedIn.id, 'testUser')
    await assert.rejects(signIn({
        ...params,
        body: {
            ...params.body,
            otp: sent.otp,
        },
    }), /invalidRequest/)
})
