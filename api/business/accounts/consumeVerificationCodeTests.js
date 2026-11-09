import assert from 'assert/strict'
import test from 'node:test'
import fixture from '../../testing/business/accounts/verificationMockProvider.js'
const { consumeVerificationCode } = await import('./consumeVerificationCode.js')
const { issueVerificationCode } = await import('./issueVerificationCode.js')

test('a proof is bound to its tenant, account and purpose and is consumed once', async () => {
    fixture.reset()
    let code
    const result = await issueVerificationCode({
        binding: { reservation: 'serverResolvedBooking' },
        deliver: async value => { code = value },
        purpose: 'bookingAccess',
        recipient: 'verifiedBookingContact',
    })
    const params = {
        challenge: result.challenge,
        code,
        purpose: 'bookingAccess',
    }
    fixture.providers.user = 'secondGuest'
    await assert.rejects(consumeVerificationCode(params))
    fixture.providers.user = 'firstGuest'
    fixture.providers.tenant = 'secondTenant'
    await assert.rejects(consumeVerificationCode(params))
    fixture.providers.tenant = 'firstTenant'
    await assert.rejects(consumeVerificationCode({
        ...params,
        purpose: 'anotherPurpose',
    }))
    const results = await Promise.allSettled([consumeVerificationCode(params), consumeVerificationCode(params)])
    assert.equal(results.filter(value => value.status === 'fulfilled').length, 1)
    assert.deepEqual(results.find(value => value.status === 'fulfilled').value, { reservation: 'serverResolvedBooking' })
})

test('expired challenges and wrong codes cannot produce reusable proof', async () => {
    for (const expired of [true, false]) {
        fixture.reset()
        let code
        const result = await issueVerificationCode({
            binding: { reservation: 'serverResolvedBooking' },
            deliver: async value => { code = value },
            purpose: 'bookingAccess',
        })
        if (expired) [...fixture.values.values()][0].expiresAt = Date.now() - 1
        await assert.rejects(consumeVerificationCode({
            challenge: result.challenge,
            code: expired ? code : 'invalidCode',
            purpose: 'bookingAccess',
        }))
        await assert.rejects(consumeVerificationCode({
            challenge: result.challenge,
            code,
            purpose: 'bookingAccess',
        }))
    }
})
