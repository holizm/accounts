import { createOnPost } from 'core'
import { createPerson } from "contacts"
import { getUserByUsername } from "./GetByUsername.js"

export const getUserByPhone = async phone => {
    let user = await getUserByUsername(phone)
    if (!user) {
        const person = await createPerson({
            meaning: phone
        })
        await createOnPost({
            part: "Accounts",
            type: "User",
            username: phone,
            lastSyncUtcDate: new Date(),
            person: person.id,
        })
    }
    user = await getUserByUsername(phone)
    return user
}
