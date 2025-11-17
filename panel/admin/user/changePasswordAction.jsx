import { EntityAction } from 'list'
import ChangePasswordDialog from "./changePasswordDialog"

const ChangePasswordAction = props => <EntityAction
    {...props}
    title="AccountsChangePassword"
    icon="Password"
    dialog={ChangePasswordDialog}
/>

export default ChangePasswordAction
