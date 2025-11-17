import { post } from "base"

const syncUser = (session) => {
    return post("user/syncByGuid", {
        "userGuid": session?.value?.user?.guid
    })
}

export default syncUser
