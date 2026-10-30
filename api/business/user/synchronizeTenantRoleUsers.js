import { availableParallelism } from 'os'
import ensureRecordRoleUser from './ensureRecordRoleUser.js'
import getRecordRolePeople from './getRecordRolePeople.js'

export const synchronizeTenantRoleUsers = async ({
    offset,
    target,
}) => {
    const page = await getRecordRolePeople({
        offset,
        role: target.role,
        tenant: target.tenant,
    })
    const users = []
    const errors = []
    let next = 0
    const work = async () => {
        while (next < page.people.length) {
            const candidate = page.people[next++]
            try {
                users.push(await ensureRecordRoleUser({
                    candidate,
                    role: target.role,
                    target,
                }))
            }
            catch (e) {
                errors.push({
                    code: typeof e.code === 'string' ? e.code : 'coreApiRoleAccessFailed',
                    person: candidate.person.id,
                })
            }
        }
    }
    await Promise.all(Array.from({ length: Math.min(availableParallelism(), page.people.length) }, work))
    const result = {
        errors,
        hasMore: page.hasMore,
        nextOffset: page.nextOffset,
        users,
    }
    return result
}
