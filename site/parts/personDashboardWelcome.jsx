import DashboardWelcomeDetails from 'accountsPersonDashboardWelcomeDetails'
import DashboardWelcomeHeader from 'accountsPersonDashboardWelcomeHeader'

export default props => <section class='welcome'>
    <DashboardWelcomeHeader {...props} />
    <DashboardWelcomeDetails {...props} />
</section>
