import {
    getCollection,
    settings,
} from 'core'
import getRolePerson from './getRolePerson.js'

export default async ({
    offset = 0,
    role,
    tenant,
}) => {
    const people = new Map()
    let hasMore = false
    const sources = (settings.roleUserSources || []).filter(source => source.role === role)
    for (const source of sources) {
        const collection = await getCollection(source.part, source.type)
        const references = await collection.aggregate([
            { $match: { tenant } },
            { $group: { _id: `$${source.property}` } },
            { $sort: { _id: 1 } },
            { $skip: offset },
            { $limit: 101 },
        ]).toArray()
        hasMore ||= references.length > 100
        for (const reference of references.slice(0, 100)) {
            const person = await getRolePerson(reference._id, tenant, { employeeRequired: source.employeeRequired })
            if (person) people.set(person.person.id, person)
        }
    }
    const result = {
        hasMore,
        nextOffset: offset + 100,
        people: [...people.values()],
    }
    return result
}
