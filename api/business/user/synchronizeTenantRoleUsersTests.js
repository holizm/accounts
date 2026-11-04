import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
mock.module('./getRecordRolePeople.js', { exports: { default: async () => {
    const page = {
        hasMore: true,
        nextOffset: 100,
        people: ['allowed', 'disabled'].map(id => {
            const person = { person: { id } }
            return person
        }),
    }
    return page
} } })
mock.module('./ensureRecordRoleUser.js', { exports: { default: async ({ candidate, role }) => {
    assert.equal(role, 'maintenance')
    if (candidate.person.id === 'disabled') throw { code: 'userIdentityFetchFailed' }
    const user = { uuid: candidate.person.id }
    return user
} } })
const { synchronizeTenantRoleUsers } = await import('./synchronizeTenantRoleUsers.js')
test('one unavailable identity is reported without abandoning valid users or pagination', async () => {
    const result = await synchronizeTenantRoleUsers({
        offset: 0,
        target: { role: 'maintenance' },
    })
    assert.deepEqual(result.users, [{ uuid: 'allowed' }])
    assert.deepEqual(result.errors, [{
        code: 'userIdentityFetchFailed',
        person: 'disabled',
    }])
    assert.equal(result.hasMore, true)
    assert.equal(result.nextOffset, 100)
})
