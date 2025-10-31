import {
    component$,
    useVisibleTask$,
} from "@builder.io/qwik"
import {
    loadDashboard,
    syncUser,
    useSession,
} from "Accounts"

const Index = component$(() => {

    const data = loadDashboard().value
    const { translations } = data
    const session = useSession()

    useVisibleTask$(async () => {
        if (session?.value?.user?.guid) {
            await syncUser(session)
        }
    })

    return <div class={"flex flex-col sm:flex-row max-w-6xl mx-auto bg-gray-100 rounded-md my-10 justify-center item-center text-center"}>
        <span>{translations.dashboardWelcomeMessage}</span>
    </div>
})

export default Index
