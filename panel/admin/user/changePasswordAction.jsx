import { ItemAction } from 'list'
import ChangePasswordDialog from "./changePasswordDialog"

export default props => <ItemAction
    {...props}
    title='accountsChangePassword'
    icon='password'
    dialog={ChangePasswordDialog}
/>
