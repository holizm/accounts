import {
    component$,
    Slot,
} from '@builder.io/qwik'
import AccountsDashboardContent from 'accountsDashboardContent'
import AccountsDashboardSidebar from 'accountsDashboardSidebar'

export default component$(props => <main class='dashboard'>
    <AccountsDashboardSidebar {...props} />
    <AccountsDashboardContent>
        <Slot />
    </AccountsDashboardContent>
</main>)
