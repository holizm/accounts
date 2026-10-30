import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
const profile = {
    attributes: [{
        name: 'email',
        permissions: {
            edit: ['admin', 'user'],
            view: ['admin', 'user'],
        },
    }],
    groups: [{ name: 'existing' }],
}
let writes = 0
mock.module('../getIamRealm.js', { exports: { default: async () => {
    const configuration = {
        baseUrl: 'https://accounts.example.com',
        realm: 'target',
    }
    return configuration
} } })
mock.module('../iam.js', { exports: {
    iamGet: async () => profile,
    iamPut: async (path, value) => {
        assert.equal(path, 'users/profile')
        assert.equal(value.groups[0].name, 'existing')
        writes++
    },
} })
mock.module('core', { exports: { serverError: code => { throw new Error(code) } } })
const { default: ensure } = await import('./ensureRealmUserLinks.js')
test('record links are administrator-only without changing ordinary user profile permissions', async () => {
    await Promise.all([ensure({}), ensure({})])
    assert.equal(writes, 1)
    assert.deepEqual(profile.attributes[0].permissions.edit, ['admin', 'user'])
    for (const name of ['person', 'tenant']) {
        const attribute = profile.attributes.find(item => item.name === name)
        assert.deepEqual(attribute.permissions, {
            edit: ['admin'],
            view: ['admin'],
        })
    }
})
