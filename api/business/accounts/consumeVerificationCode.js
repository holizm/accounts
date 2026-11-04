import {
    clientError,
    consumeFromCache,
    getFromCache,
    providers,
} from 'core'
import { makePasswordFromOtp } from './sendOtp.js'

export const consumeVerificationCode = async ({
    challenge,
    code,
    purpose,
}) => {
    if (!providers.user || !providers.tenant || typeof challenge !== 'string' || typeof code !== 'string') clientError('invalidRequest')
    const scope = {
        item: challenge,
        part: 'accounts',
        tenant: providers.tenant,
        type: 'verificationCode',
    }
    const pending = await getFromCache(scope)
    if (!pending || pending.user !== providers.user || pending.purpose !== purpose || pending.expiresAt <= Date.now()) clientError('invalidRequest')
    const accepted = await consumeFromCache(scope)
    if (!accepted || accepted.user !== providers.user || accepted.purpose !== purpose || accepted.expiresAt <= Date.now()) clientError('invalidRequest')
    const hash = makePasswordFromOtp(JSON.stringify([challenge, code.trim().toUpperCase()]))
    if (accepted.hash !== hash) clientError('invalidRequest')
    return accepted.binding
}
