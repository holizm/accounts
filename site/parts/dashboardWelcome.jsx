import {
    DashboardWelcomeDetails,
    DashboardWelcomeHeader,
} from 'accounts'

export default props => <section class='welcome'>
    <DashboardWelcomeHeader {...props} />
    <DashboardWelcomeDetails {...props} />
</section>
