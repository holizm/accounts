import { EntityAction } from "List"
import ChangePasswordDialog from "./ChangePasswordDialog"

const ChangePasswordAction = props => <EntityAction
    {...props}
    title="AccountsChangePassword"
    icon="Password"
    dialog={ChangePasswordDialog}
/>

export default ChangePasswordAction
