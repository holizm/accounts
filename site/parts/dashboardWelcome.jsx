import AccountsDashboardWelcomeDetails from 'accountsDashboardWelcomeDetails'
import AccountsDashboardWelcomeHeader from 'accountsDashboardWelcomeHeader'

export default props => <section class='welcome'>
    <AccountsDashboardWelcomeHeader {...props} />
    <AccountsDashboardWelcomeDetails {...props} />
</section>
