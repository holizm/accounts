import { post } from "core"

export default (session) => {
    return post("user/syncByGuid", {
        "userGuid": session?.value?.user?.guid
    })
}
