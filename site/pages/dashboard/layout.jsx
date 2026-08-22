import {
    component$,
    Slot,
} from '@builder.io/qwik'
import {
    checkLogin,
    DashboardLayout,
    loadDashboard,
} from 'accounts'
// import { Menu } from 'dashboard'

export const onRequest = event => {
    checkLogin(event)
}

export default component$(() => {

    const data = loadDashboard().value
    const { translations } = data
    return <DashboardLayout signOutText={translations.accountsSignOut}>
        {
            // Menu?.map((item, index) => {
            //     return <button
            //         class={`p-2 block rounded-md ${url.pathname.includes(item.path) ? 'bg-custom-color1 text-white' : 'bg-gray-200 hover:bg-custom-color1/40 duration-300'}`}
            //         key={index + 1}
            //         onClick$={() => {
            //             window.location.href = `/dashboard${item.path}`
            //         }}
            //     >
            //         {translations[item.title]}
            //     </button>
            // })
        }
        <Slot />
    </DashboardLayout>
})


export { loadDashboard }
