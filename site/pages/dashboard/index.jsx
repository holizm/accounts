import {
    component$,
    useVisibleTask$,
} from '@builder.io/qwik'
import {
    DashboardWelcome,
    loadDashboard,
    syncUser,
    useSession,
} from 'accounts'

export default component$(() => {

    const data = loadDashboard().value
    const session = useSession()

    useVisibleTask$(async () => {
        if (session?.value?.user?.id) {
            await syncUser(session)
        }
    })

    return <DashboardWelcome
        {...data}
        session={session}
    />
})
