import { ListAction } from 'list'
import CreateUserForPersonDialog from './createUserForPersonDialog'

export default <>
    <ListAction
        title='sync'
        icon='syncAlt'
        post='/accounts/user/syncAll'
        notApplicableToItems
        superAdmin
    />
    <ListAction
        title='forPerson'
        icon='personAdd'
        dialog={CreateUserForPersonDialog}
    />
</>
