import { ItemAction } from 'list'
import ChangePasswordDialog from './changePasswordDialog'

export default props => <ItemAction
    {...props}
    title='changePassword'
    icon='password'
    dialog={ChangePasswordDialog}
/>
