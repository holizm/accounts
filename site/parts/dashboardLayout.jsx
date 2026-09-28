import {
    component$,
    Slot,
} from '@builder.io/qwik'
import {
    DashboardContent,
    DashboardSidebar,
} from 'accounts'

export default component$(props => <main class='dashboard'>
    <DashboardSidebar {...props} />
    <DashboardContent>
        <Slot />
    </DashboardContent>
</main>)
