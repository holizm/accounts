import {
    component$,
    Slot,
} from '@builder.io/qwik'
import DashboardContent from 'accountsPersonDashboardContent'
import DashboardSidebar from 'accountsPersonDashboardSidebar'

export default component$(props => <main class='dashboard'>
    <DashboardSidebar {...props} />
    <DashboardContent>
        <Slot />
    </DashboardContent>
</main>)
