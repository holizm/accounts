import {
    ensure,
    getTenant,
    httpForm,
    settings,
} from 'core'
import { makePasswordFromOtp } from './sendOtp.js'

export const signIn = async params => {
    const {
        otp,
        phone,
    } = params
    ensure(phone).isSomething('phoneIsEmpty')
    ensure(otp).isSomething('otpIsEmpty')
    const tenant = getTenant(params.host)
    const tenantSettings = settings.production?.site?.iamClientSecrets?.find(
        item => item.domain === tenant.prodDomain
    )
    const accountsUrl = settings.accounts.url.replace(/\/$/, '')
    const url = `${accountsUrl}/realms/${tenant.id}/protocol/openid-connect/token`
    const { responseJson } = await httpForm(url, {
        client_id: 'site',
        client_secret: tenantSettings?.secret,
        grant_type: 'password',
        password: makePasswordFromOtp(otp),
        username: phone,
    })
    return responseJson
}
