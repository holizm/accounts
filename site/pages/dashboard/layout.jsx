import {
    Slot,
    component$,
} from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'
import {
    checkLogin,
    DashboardLayout,
    loadDashboard,
} from 'accounts'
import { Menu } from 'dashboard'

export const onRequest = event => checkLogin(event)

export default component$(() => {
    const data = loadDashboard().value
    const { url } = useLocation()

    return <DashboardLayout
        {...data}
        menu={Menu}
        pathname={url?.pathname}
    >
        <Slot />
    </DashboardLayout>
})

export { loadDashboard }
