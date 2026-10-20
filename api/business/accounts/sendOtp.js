import crypto from 'crypto'
// import otplib from 'otplib'
import {
    cache,
    claimCache,
    clientError,
    ensure,
    settings,
} from 'core'
import { sendTextMessage } from 'notifications'
import { getUserByPhone } from '../user/getByPhone.js'
import { changePassword } from '../user/changePassword.js'
import getOtpScope from './getOtpScope.js'

export const sendOtp = async params => {
    const phone = (params.body?.phone || params.phone)?.trim()
    ensure(phone).isSomething('phoneIsEmpty').and.isPhone('invalidRequest')
    const scope = getOtpScope({
        host: params.host,
        phone,
    })
    const cooldownScope = { ...scope }
    cooldownScope.type = 'otpCooldown'
    const now = Date.now()
    const claimed = await claimCache({
        ...cooldownScope,
        data: true,
        ttlSeconds: 60,
    })
    if (!claimed) clientError('invalidRequest')
    const user = await getUserByPhone(phone)
    const {
        otp,
        seconds,
    } = getOtp(params.otp)
    const password = crypto.randomBytes(32).toString('hex')
    await changePassword({
        ...params,
        password,
        user: user.uuid,
    })
    if (!settings.isDeveloping) {
        await sendTextMessage({
            ...params,
            item: user,
            notificationKey: 'sendOtp',
            phone,
            tokens: { otp }
        })
    }

    await cache({
        ...scope,
        data: {
            expiresAt: now + seconds * 1000,
            hash: makePasswordFromOtp(otp),
            password,
            userId: user.uuid,
        },
        ttlSeconds: seconds,
    })

    const result = {
        otpLength: otp.length,
        otpLifetimeInSeconds: seconds,
        resendDelayInSeconds: 60,
        sent: true,
    }
    if (settings.isDeveloping) result.otp = otp
    return result
}

const getOtp = providedOtp => {
    const seconds = Math.min(900, Math.max(60, Math.trunc(Number(settings.otpLifetimeInSeconds) || 300))) // parseInt(CoreConfig.getSetting('otpLifetimeInSeconds') || '60', 10)
    const length = Math.min(8, Math.max(4, Math.trunc(Number(settings.otpLength) || 5))) // parseInt(CoreConfig.getSetting('otpLength') || '5', 10)
    // const TotpGenerator = otplib.totp
    // TotpGenerator.options = {
    //     algorithm: 'sha512',
    //     digits: length,
    //     step: seconds,
    // }
    // return TotpGenerator.generate(userKey)
    const otp = providedOtp === undefined || providedOtp === null
        ? String(crypto.randomInt(10 ** (length - 1), 10 ** length))
        : String(providedOtp)
    ensure(otp).isSomething('otpIsEmpty')
    const code = {
        otp,
        seconds,
    }
    return code
}

export const makePasswordFromOtp = otp => {
    const hash = crypto.createHash('sha256').update(otp, 'utf8').digest('hex')
    const alphanumericHash = hash.replace(/[^a-zA-Z0-9]/g, '')
    return alphanumericHash
}
