import assert from 'assert/strict'
import crypto from 'crypto'
import test from 'node:test'
import fixtures from './otpFixturesTests.js'

const {
    cache,
    sendTextMessage,
    settings,
} = fixtures
const { sendOtp } = await import('./sendOtp.js')

test('uses the supplied internal OTP for delivery and cached verification without generating another code', async t => {
    t.mock.method(crypto, 'randomInt', () => assert.fail('OTP generation was called'))
    settings.isDeveloping = false
    t.after(() => { settings.isDeveloping = true })
    for (const supplied of ['003412', 123456]) {
        const result = await sendOtp({
            host: 'api.example.local',
            otp: supplied,
            phone: '+15550001111',
        })
        const expected = String(supplied)
        const stored = cache.mock.calls.at(-1).arguments[0]
        assert.equal(sendTextMessage.mock.calls.at(-1).arguments[0].tokens.otp, expected)
        assert.equal(stored.data.hash, crypto.createHash('sha256').update(expected).digest('hex'))
        assert.equal(stored.ttlSeconds, 120)
        assert.equal(result.otpLength, expected.length)
        assert.equal(Object.hasOwn(result, 'otp'), false)
    }
})

test('public request body cannot choose its own login OTP', async t => {
    const generator = t.mock.method(crypto, 'randomInt', () => 654321)
    const result = await sendOtp({
        body: {
            otp: '000000',
            phone: '+15550001111',
        },
        host: 'api.example.local',
    })
    assert.equal(result.otp, '654321')
    assert.equal(generator.mock.callCount(), 1)
})
