import { ListAction } from 'list'
import CreateUserForPersonDialog from './createUserForPersonDialog'

export default <>
    <ListAction
        icon='syncAlt'
        notApplicableToItems
        post='/accounts/user/syncAll'
        superAdmin
        title='sync'
    />
    <ListAction
        dialog={CreateUserForPersonDialog}
        icon='personAdd'
        title='forPerson'
    />
</>
