import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
const records = {
    contact: { displayName: 'Existing person' },
    employee: { naturalPerson: 'natural' },
    natural: {
        firstName: 'Sample',
        id: 'natural',
        lastName: 'Technician',
        person: 'person',
    },
    person: {
        contact: 'contact',
        id: 'person',
        meaning: 'sampleEmployeePerson',
    },
}
let hasEmployee = true
mock.module('core', { namedExports: {
    getCollection: async (part, type) => {
        const collection = { findOne: async query => {
            assert.equal(query.tenant, 'target')
            if (type === 'employee' && query.$or) return hasEmployee ? records.employee : null
            return query.$or ? records.natural : records[query.id]
        } }
        return collection
    },
    parseId: id => {
        const parsed = {
            part: id === 'employee' ? 'organization' : 'contacts',
            tenant: id === 'foreign' ? 'other' : 'target',
            type: id === 'natural' ? 'naturalPerson' : id,
        }
        return parsed
    },
} })
const { default: getRolePerson } = await import('./getRolePerson.js')
test('employee, natural-person and embedded person references reuse one existing person', async () => {
    for (const reference of ['employee', 'natural', { id: 'person' }]) {
        const result = await getRolePerson(reference, 'target')
        assert.equal(result.person.id, 'person')
        assert.equal(result.name, 'Sample Technician')
        assert.equal(result.contact, records.contact)
        assert.equal(result.sample, true)
    }
})
test('foreign-tenant and unsupported record references cannot become role users', async () => {
    assert.equal(await getRolePerson('foreign', 'target'), null)
    assert.equal(await getRolePerson('reservation', 'target'), null)
})

test('employee-only sources cannot provision an unrelated customer person', async () => {
    assert.ok(await getRolePerson('person', 'target', { employeeRequired: true }))
    hasEmployee = false
    assert.equal(await getRolePerson('person', 'target', { employeeRequired: true }), null)
    hasEmployee = true
})
