import { ItemAction } from 'list'
import ChangePasswordDialog from "./changePasswordDialog"

export default props => <ItemAction
    {...props}
    title="AccountsChangePassword"
    icon="Password"
    dialog={ChangePasswordDialog}
/>
