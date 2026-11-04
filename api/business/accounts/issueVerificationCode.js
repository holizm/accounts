import {
    cache,
    claimCache,
    clientError,
    createUuid,
    providers,
} from 'core'
import { makePasswordFromOtp } from './sendOtp.js'

export const issueVerificationCode = async ({
    binding,
    deliver,
    purpose,
    recipient,
}) => {
    const lifetimeSeconds = 300
    const resendSeconds = 60
    if (!providers.user || !providers.tenant || typeof purpose !== 'string' || typeof deliver !== 'function') clientError('invalidRequest')
    const accountClaim = await claimCache({
        data: true,
        item: makePasswordFromOtp(JSON.stringify([purpose, providers.user])),
        part: 'accounts',
        tenant: providers.tenant,
        ttlSeconds: resendSeconds,
        type: 'verificationAccountCooldown',
    })
    if (!accountClaim) clientError('invalidRequest')
    if (recipient) {
        const recipientClaim = await claimCache({
            data: true,
            item: makePasswordFromOtp(JSON.stringify([purpose, recipient])),
            part: 'accounts',
            tenant: providers.tenant,
            ttlSeconds: resendSeconds,
            type: 'verificationRecipientCooldown',
        })
        if (!recipientClaim) clientError('invalidRequest')
    }
    const challenge = createUuid()
    const code = createUuid().slice(0, 8).toUpperCase()
    await deliver(code)
    await cache({
        data: {
            binding,
            expiresAt: Date.now() + lifetimeSeconds * 1000,
            hash: makePasswordFromOtp(JSON.stringify([challenge, code])),
            purpose,
            user: providers.user,
        },
        item: challenge,
        part: 'accounts',
        tenant: providers.tenant,
        ttlSeconds: lifetimeSeconds,
        type: 'verificationCode',
    })
    const result = {
        challenge,
        expiresInSeconds: lifetimeSeconds,
        resendDelayInSeconds: resendSeconds,
    }
    return result
}
