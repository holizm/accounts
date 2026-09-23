import crypto from 'crypto'
// import otplib from 'otplib'
import {
    ensure,
    error,
    settings,
} from 'core'
import { sendTextMessage } from 'notifications'
import { getUserByPhone } from '../user/getByPhone.js'
import { getKey } from '../key/getKey.js'
import { changePassword } from '../user/changePassword.js'

export const sendOtp = async params => {
    let {
        phone,
        otp,
    } = params
    ensure(phone).isSomething('phoneIsEmpty')
    const user = await getUserByPhone(phone)
    const { value } = await getKey(user.id)
    if (!otp) {
        otp = createTotp(value)
    }
    const password = makePasswordFromOtp(otp)
    await changePassword({
        ...params,
        password,
        user: user.id,
    })
    await sendTextMessage({
        ...params,
        item: user,
        phone,
        notificationKey: 'sendOtp',
        tokens: { otp }
    })

    const result = {
        sent: true,
        otpLength: otp.length,
    }
    if (settings.isDeveloping) {
        result.otp = otp
    }
    return result
}

const createTotp = userKey => {
    const seconds = 60 // parseInt(CoreConfig.getSetting('otpLifetimeInSeconds') || '60', 10)
    const length = 5 // parseInt(CoreConfig.getSetting('otpLength') || '5', 10)
    // const TotpGenerator = otplib.totp
    // TotpGenerator.options = {
    //     algorithm: 'sha512',
    //     digits: length,
    //     step: seconds,
    // }
    // return TotpGenerator.generate(userKey)
    return ''
}

export const makePasswordFromOtp = otp => {
    const hash = crypto.createHash('sha256').update(otp, 'utf8').digest('hex')
    const alphanumericHash = hash.replace(/[^a-zA-Z0-9]/g, '')
    return alphanumericHash
}
