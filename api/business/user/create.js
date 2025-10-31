import {
    createOnPost,
    parseId,
} from "Core"

export const createUser = async params => {
    const naturalPerson = await createOnPost({
        ...params,
        part: "Contacts",
        type: "NaturalPerson",
    })
    const parsedId = parseId(naturalPerson.id)
    const user = await createOnPost({
        ...params,
        part: "Accounts",
        type: "User",
        meaning: parsedId.meaning,
        person: naturalPerson.person,
    })
    return user
}
