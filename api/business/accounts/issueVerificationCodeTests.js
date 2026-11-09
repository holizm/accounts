import assert from 'assert/strict'
import test from 'node:test'
import fixture from '../../testing/business/accounts/verificationMockProvider.js'
const { issueVerificationCode } = await import('./issueVerificationCode.js')

test('verification delivers a code once, stores only its hash and throttles account and recipient', async () => {
    fixture.reset()
    let delivered
    const params = {
        binding: { reservation: 'serverResolvedBooking' },
        deliver: async code => { delivered = code },
        purpose: 'bookingAccess',
        recipient: 'verifiedBookingContact',
    }
    const result = await issueVerificationCode(params)
    assert.match(delivered, /^[A-F0-9]{8}$/)
    assert.equal(result.expiresInSeconds, 300)
    assert.equal(result.code, undefined)
    const saved = [...fixture.values.values()][0]
    assert.equal(saved.code, undefined)
    assert.doesNotMatch(JSON.stringify(saved), new RegExp(delivered))
    await assert.rejects(issueVerificationCode(params))
    fixture.providers.user = 'secondGuest'
    await assert.rejects(issueVerificationCode(params))
})

test('delivery failure leaves no consumable challenge', async () => {
    fixture.reset()
    await assert.rejects(issueVerificationCode({
        binding: { reservation: 'serverResolvedBooking' },
        deliver: async () => { throw new Error('Delivery unavailable') },
        purpose: 'bookingAccess',
        recipient: 'verifiedBookingContact',
    }))
    assert.equal(fixture.values.size, 0)
})
