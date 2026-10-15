import assert from 'assert/strict'
import { createHash } from 'crypto'
import {
    mock,
    test,
} from 'node:test'

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
            const validation = { isSomething: code => { if (!value) fail(code) } }
            return validation
        },
        getTenant: () => ({ id: 'example' }),
        settings,
    },
})
mock.module('notifications', { exports: { sendTextMessage } })
mock.module('../user/getByPhone.js', { exports: { getUserByPhone } })
mock.module('../user/changePassword.js', { exports: { changePassword } })
const { sendOtp } = await import('./sendOtp.js')
const params = {
    body: { phone: ' +15550001111 ' },
    host: 'api.example.local',
}

test('development returns an OTP and caches its hash with the replacement password', async () => {
    const before = Date.now()
    const result = await sendOtp(params)
    const stored = cache.mock.calls.at(-1).arguments[0]
    const changed = changePassword.mock.calls.at(-1).arguments[0]
    assert.match(result.otp, /^\d{6}$/)
    assert.equal(result.sent, true)
    assert.equal(result.otpLength, 6)
    assert.equal(result.otpLifetimeInSeconds, 120)
    assert.equal(result.resendDelayInSeconds, 60)
    assert.equal(getUserByPhone.mock.calls.at(-1).arguments[0], '+15550001111')
    assert.equal(sendTextMessage.mock.callCount(), 0)
    assert.match(changed.password, /^[a-f0-9]{64}$/)
    assert.equal(changed.user, 'testUser')
    assert.equal(stored.data.password, changed.password)
    assert.equal(stored.data.userId, 'testUser')
    assert.equal(stored.data.hash, createHash('sha256').update(result.otp).digest('hex'))
    assert.equal(stored.ttlSeconds, 120)
    assert.ok(stored.data.expiresAt >= before + 120000)
    assert.ok(stored.data.expiresAt <= Date.now() + 120000)
    assert.equal(claimCache.mock.calls.at(-1).arguments[0].ttlSeconds, 60)
})

test('production sends the OTP without exposing it in the response', async () => {
    settings.isDeveloping = false
    try {
        const result = await sendOtp(params)
        const message = sendTextMessage.mock.calls.at(-1).arguments[0]
        assert.equal(Object.hasOwn(result, 'otp'), false)
        assert.equal(message.phone, '+15550001111')
        assert.equal(message.notificationKey, 'sendOtp')
        assert.match(message.tokens.otp, /^\d{6}$/)
        assert.equal(message.item.uuid, 'testUser')
    }
    finally {
        settings.isDeveloping = true
    }
})

test('invalid phones and cooldown rejection do not change passwords or send messages', async () => {
    const changes = changePassword.mock.callCount()
    const messages = sendTextMessage.mock.callCount()
    await assert.rejects(sendOtp({ body: {} }), /phoneIsEmpty/)
    await assert.rejects(sendOtp({ body: { phone: 'invalid' } }), /invalidRequest/)
    claimCache.mock.mockImplementationOnce(async () => false)
    await assert.rejects(sendOtp(params), /invalidRequest/)
    assert.equal(changePassword.mock.callCount(), changes)
    assert.equal(sendTextMessage.mock.callCount(), messages)
})
