import {
    getCollection,
    parseId,
} from 'core'

export default async (reference, tenant, options = {}) => {
    let id = reference?.id || reference
    let name
    let firstName
    let lastName
    let naturalPerson
    let employee = false
    for (let depth = 0; depth < 3 && typeof id === 'string'; depth++) {
        const parsed = parseId(id)
        if (parsed.tenant !== tenant || !['organization.employee', 'contacts.naturalPerson', 'contacts.person'].includes(`${parsed.part}.${parsed.type}`)) return null
        const collection = await getCollection(parsed.part, parsed.type)
        const item = await collection.findOne({
            id,
            tenant,
        })
        if (!item) return null
        if (parsed.type === 'person') {
            if (!name && !item.displayName || options.employeeRequired && !naturalPerson) {
                const naturalPeople = await getCollection('contacts', 'naturalPerson')
                const natural = await naturalPeople.findOne({
                    $or: [{ person: id }, { 'person.id': id }],
                    tenant,
                })
                name = natural?.fullName || [natural?.firstName, natural?.lastName].filter(Boolean).join(' ')
                firstName = natural?.firstName
                lastName = natural?.lastName
                naturalPerson = natural?.id
            }
            if (options.employeeRequired && !employee) {
                const employees = await getCollection('organization', 'employee')
                const membership = naturalPerson && await employees.findOne({
                    $or: [{ naturalPerson }, { 'naturalPerson.id': naturalPerson }],
                    tenant,
                })
                if (!membership) return null
            }
            const contactId = item.contact?.id || item.contact
            const contacts = await getCollection('contacts', 'contact')
            const contact = await contacts.findOne({
                id: contactId,
                tenant,
            })
            const emails = await getCollection('contacts', 'email')
            const email = await emails.findOne({
                $or: [{ contact: contactId }, { 'contact.id': contactId }],
                tenant,
            }, { sort: { default: -1 } })
            const result = {
                contact,
                email: email?.value,
                firstName,
                lastName,
                name: name || item.displayName || contact?.displayName || item.meaning,
                person: item,
                sample: item.meaning?.startsWith('sample') === true,
            }
            return result
        }
        if (parsed.type === 'naturalPerson') {
            naturalPerson = id
            firstName = item.firstName
            lastName = item.lastName
            name = item.fullName || [firstName, lastName].filter(Boolean).join(' ')
        }
        if (parsed.type === 'employee') employee = true
        const next = parsed.type === 'employee' ? item.naturalPerson : item.person
        id = next?.id || next
    }
    return null
}
