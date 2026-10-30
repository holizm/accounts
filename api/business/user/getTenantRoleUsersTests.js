import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
let query
mock.module('../iam.js', { namedExports: { iamGet: async path => {
    assert.ok(!path.includes('foreign'))
    if (path.endsWith('/composite')) return [{ name: path.includes('noRole') ? 'staff' : 'maintenance' }]
    const user = {
        enabled: !path.includes('disabled'),
        firstName: 'Allowed',
        id: path.split('/')[1],
    }
    return user
} } })
mock.module('core', { namedExports: {
    getCollection: async () => {
        const collection = { find: value => {
            query = value
            const cursor = {
                limit: () => cursor,
                skip: () => cursor,
                sort: () => cursor,
                toArray: async () => [{ uuid: 'allowed' }, { uuid: 'disabled' }, { uuid: 'noRole' }],
            }
            return cursor
        } }
        return collection
    },
    serverError: code => { throw new Error(code) },
} })
const { getTenantRoleUsers } = await import('./getTenantRoleUsers.js')
test('role membership is intersected with tenant records and disabled users are excluded', async () => {
    const result = await getTenantRoleUsers({ target: {
        role: 'maintenance',
        tenant: 'target',
        tenantConfiguration: {},
    } })
    assert.equal(query.tenant, 'target')
    assert.deepEqual(result.users, [{
        name: 'Allowed',
        uuid: 'allowed',
    }])
    assert.equal(result.hasMore, false)
})
