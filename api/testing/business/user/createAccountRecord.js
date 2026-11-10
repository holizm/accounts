import { createUuid } from 'core/core/createUuid.js'

export default async ({
    environment,
    uuid,
}) => {
    const insert = async (part, type, values) => {
        const id = await environment.generateId({
            locale: 'shared',
            meaning: 'verification',
            part,
            tenant: environment.tenant,
            type,
        })
        const record = {
            ...values,
            id,
            locale: 'shared',
            part,
            tenant: environment.tenant,
            type,
        }
        await (await environment.collection(part, type)).insertOne(record)
        return record
    }
    const person = await insert('contacts', 'person', {})
    return await insert('accounts', 'user', {
        person: person.id,
        uuid: uuid || createUuid(),
    })
}
