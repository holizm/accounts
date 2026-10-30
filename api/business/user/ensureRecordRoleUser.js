import { createHash } from 'crypto'
import {
    clientError,
    getCollection,
} from 'core'
import {
    iamGet,
    iamPost,
    iamPut,
} from '../iam.js'
import { createTenantIamOptions } from '../tenantIamOptions.js'
import { addRealmRole } from './addRealmRole.js'
import ensureRealmUserLinks from './ensureRealmUserLinks.js'
import ensureRoleUserRecords from './ensureRoleUserRecords.js'

export default async ({
    candidate,
    role,
    target,
}) => {
    const users = await getCollection('accounts', 'user')
    const query = {
        $or: [{ person: candidate.person.id }, { 'person.id': candidate.person.id }],
        tenant: target.tenant,
    }
    const existing = await users.findOne(query)
    const options = createTenantIamOptions(target.tenantConfiguration)
    const username = existing?.username || `member${createHash('sha256').update(candidate.person.id).digest('hex').slice(0, 32)}`
    const email = candidate.email || (candidate.sample ? `${username}@example.invalid` : undefined)
    let account = existing?.uuid && await iamGet(`users/${encodeURIComponent(existing.uuid)}`, options)
    if (existing && !account?.id) clientError('userIdentityFetchFailed')
    if (!account?.id) {
        await ensureRealmUserLinks(options)
        let matches = await iamGet(`users?username=${encodeURIComponent(username)}&exact=true`, options)
        if (!matches?.length) {
            await iamPost('users', {
                attributes: {
                    person: [candidate.person.id],
                    tenant: [target.tenant],
                },
                enabled: true,
                email,
                emailVerified: false,
                firstName: candidate.firstName || candidate.name,
                lastName: candidate.lastName,
                username,
            }, options)
            matches = await iamGet(`users?username=${encodeURIComponent(username)}&exact=true`, options)
        }
        account = matches?.[0]
        if (!account?.id) clientError('iamUserCreationFailed')
        if (existing?.uuid && existing.uuid !== account.id) clientError('userIdentityFetchFailed')
        if (!existing && account.attributes?.person?.[0] !== candidate.person.id) clientError('userIdentityFetchFailed')
    }
    if (!account.enabled) clientError('userIdentityFetchFailed')
    if (account.attributes?.person?.[0] === candidate.person.id) {
        const changes = {}
        if (!account.email && email) changes.email = email
        for (const field of ['email', 'firstName', 'lastName']) {
            if (!account[field] && candidate[field]) changes[field] = candidate[field]
        }
        if (changes.lastName && account.firstName === candidate.name) changes.firstName = candidate.firstName
        if (Object.keys(changes).length) await iamPut(`users/${account.id}`, {
            ...account,
            ...changes,
        }, options)
    }
    await ensureRoleUserRecords({
        account,
        candidate,
        existing,
        target,
        username,
    })
    await addRealmRole({
        role,
        tenantConfiguration: target.tenantConfiguration,
        uuid: account.id,
    })
    const result = {
        name: candidate.name,
        uuid: account.id,
    }
    return result
}
