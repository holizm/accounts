import {
    create,
    parseId,
} from 'core'

export const createUser = async params => {
    const naturalPerson = await create({
        ...params,
        part: 'contacts',
        type: 'naturalPerson',
    })
    const parsedId = parseId(naturalPerson.id)
    const user = await create({
        ...params,
        part: 'accounts',
        type: 'user',
        meaning: parsedId.meaning,
        person: naturalPerson.person,
    })
    return user
}
