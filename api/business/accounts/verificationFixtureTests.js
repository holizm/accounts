import {
    createHash,
    randomUUID,
} from 'crypto'
import { mock } from 'node:test'

const values = new Map()
const claims = new Set()
const providers = {
    tenant: 'firstTenant',
    user: 'firstGuest',
}
const key = scope => JSON.stringify(scope)
const fail = code => { throw new Error(code) }
mock.module('core', {
    namedExports: {
        cache: async ({
            data,
            ttlSeconds,
            ...rest
        }) => values.set(key(rest), data),
        claimCache: async ({
            data,
            ttlSeconds,
            ...rest
        }) => {
            const scope = key(rest)
            if (claims.has(scope)) return false
            claims.add(scope)
            return true
        },
        clientError: fail,
        consumeFromCache: async scope => {
            const result = values.get(key(scope))
            values.delete(key(scope))
            return result
        },
        createUuid: randomUUID,
        getFromCache: async scope => values.get(key(scope)),
        providers,
    },
})
mock.module('./sendOtp.js', { namedExports: { makePasswordFromOtp: value => createHash('sha256').update(value).digest('hex') } })
export default {
    claims,
    providers,
    reset: () => {
        values.clear()
        claims.clear()
        providers.tenant = 'firstTenant'
        providers.user = 'firstGuest'
    },
    values,
}
