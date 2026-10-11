import {
    clientError,
    consumeFromCache,
    ensure,
    getTenant,
    httpForm,
    settings,
} from 'core'
import getAccountsBaseUrl from '../getAccountsBaseUrl.js'
import { makePasswordFromOtp } from './sendOtp.js'
import getOtpScope from './getOtpScope.js'

export const signIn = async params => {
    const otp = (params.body?.otp || params.otp)?.trim()
    const phone = (params.body?.phone || params.phone)?.trim()
    ensure(phone).isSomething('phoneIsEmpty')
    ensure(otp).isSomething('otpIsEmpty')
    const scope = getOtpScope({ host: params.host, phone })
    const challenge = await consumeFromCache(scope)
    if (!challenge || challenge.expiresAt <= Date.now()) {
        clientError('invalidRequest')
    }
    const hash = makePasswordFromOtp(otp)
    if (challenge.hash !== hash) clientError('invalidRequest')
    const tenant = getTenant(params.host)
    const tenantSettings = settings.production?.site?.iamClientSecrets?.find(
        item => item.domain === tenant.prodDomain
    )
    const accountsUrl = getAccountsBaseUrl(tenant)
    const url = `${accountsUrl}/realms/${tenant.realm || tenant.id}/protocol/openid-connect/token`
    const { responseJson } = await httpForm(url, {
        client_id: 'site',
        client_secret: tenantSettings?.secret,
        grant_type: 'password',
        password: challenge.password,
        username: phone,
    })
    if (!responseJson?.access_token) clientError('invalidRequest')
    const result = {
        ...responseJson,
        id: challenge.userId,
    }
    return result
}
