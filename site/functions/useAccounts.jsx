import { useSession } from "accounts"

export default session => {
    if (!session) {
        session = useSession()
    }
    const isSignedIn =
        session &&
        session.value &&
        session.value.expires &&
        new Date(session.value.expires) > new Date()

    return {
        isSignedIn: isSignedIn === true ? true : false,
        user: session?.value?.user
    }
}
