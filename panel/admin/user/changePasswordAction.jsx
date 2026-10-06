import { ItemAction } from 'list'
import ChangePasswordDialog from './changePasswordDialog'

export default props => <ItemAction
    {...props}
    superAdmin
    title='changePassword'
    icon='password'
    dialog={ChangePasswordDialog}
/>
