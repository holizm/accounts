import crypto from 'crypto'
import { totp as TotpGenerator } from 'otplib'
import {
    clientError,
    ensure,
    error,
    pascalize,
    providers,
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
    ensure(phone).isSomething('PhoneIsEmpty')
    const user = await getUserByPhone(phone)
    const { value } = await getKey(user.id)
    if (!otp) {
        const totp = createTotp(value)
        otp = totp.generate(value)
    }
    const password = makePasswordFromOtp(otp)
    await changePassword({
        ...params,
        password,
        user: user.id,
    })
    error(`OTP => ${phone} - ${otp}`)
    const template = `${pascalize(providers.tenant)}SignInCode`

    await sendTextMessage({
        item: user.id,
        phone,
        template,
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

const createTotp = () => {
    const seconds = 60 // parseInt(CoreConfig.getSetting('OtpLifetimeInSeconds') || '60', 10)
    const length = 5 // parseInt(CoreConfig.getSetting('OtpLength') || '5', 10)
    TotpGenerator.options = {
        algorithm: 'sha512',
        digits: length,
        step: seconds,
    }
    return TotpGenerator
}

const makePasswordFromOtp = otp => {
    const hash = crypto.createHash('sha256').update(otp, 'utf8').digest('hex')
    const alphanumericHash = hash.replace(/[^a-zA-Z0-9]/g, '')
    return alphanumericHash
}
