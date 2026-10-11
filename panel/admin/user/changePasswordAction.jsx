import { ItemAction } from 'list'
import ChangePasswordDialog from './changePasswordDialog'

export default props => <ItemAction
    {...props}
    dialog={ChangePasswordDialog}
    icon='password'
    superAdmin
    title='changePassword'
/>
