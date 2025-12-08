import { ItemAction } from 'list'
import ChangePasswordDialog from "./changePasswordDialog"

const ChangePasswordAction = props => <ItemAction
    {...props}
    title="AccountsChangePassword"
    icon="Password"
    dialog={ChangePasswordDialog}
/>

export default ChangePasswordAction
