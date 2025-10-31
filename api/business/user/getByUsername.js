import { getByFilter } from "Core"

export const getUserByUsername = async username => {
    const user = await getByFilter(
        {
            part: "Accounts",
            type: "User",
            doNotThrow: true,
        },
        {
            username: username
        }
    )
    return user
}
