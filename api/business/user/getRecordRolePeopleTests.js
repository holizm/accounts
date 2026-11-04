import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
let pipeline
mock.module('./getRolePerson.js', { exports: { default: async (reference, tenant) => {
    assert.equal(tenant, 'target')
    const person = {
        name: 'Worker',
        person: { id: reference },
    }
    return reference === 'invalid' ? null : person
} } })
mock.module('core', { exports: {
    getCollection: async (part, type) => {
        assert.equal(part, 'organization')
        assert.equal(type, 'employee')
        const collection = { aggregate: value => {
            pipeline = value
            const cursor = { toArray: async () => Array.from({ length: 101 }, (_, index) => {
                const reference = { _id: index ? `reference${index}` : 'invalid' }
                return reference
            }) }
            return cursor
        } }
        return collection
    },
    settings: { roleUserSources: [{
        part: 'organization',
        property: 'naturalPerson',
        role: 'staff',
        type: 'employee',
    }] },
} })
const { default: getPeople } = await import('./getRecordRolePeople.js')
test('record discovery remains scoped, paginates and excludes unresolved identities', async () => {
    const result = await getPeople({
        offset: 100,
        role: 'staff',
        tenant: 'target',
    })
    assert.deepEqual(pipeline[0], { $match: { tenant: 'target' } })
    assert.deepEqual(pipeline[3], { $skip: 100 })
    assert.equal(result.hasMore, true)
    assert.equal(result.nextOffset, 200)
    assert.equal(result.people.length, 99)
})
test('undeclared privileged roles are not inferred from employee records', async () => {
    const result = await getPeople({
        role: 'owner',
        tenant: 'target',
    })
    assert.deepEqual(result.people, [])
})
