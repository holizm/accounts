import { useSession } from "Accounts"

const useAccounts = session => {
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

export default useAccounts
