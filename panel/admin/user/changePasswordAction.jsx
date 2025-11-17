import { EntityAction } from 'list'
import ChangePasswordDialog from "./ChangePasswordDialog"

const ChangePasswordAction = props => <EntityAction
    {...props}
    title="AccountsChangePassword"
    icon="Password"
    dialog={ChangePasswordDialog}
/>

export default ChangePasswordAction
