import { ListAction } from 'list'
import CreateUserForPersonDialog from './createUserForPersonDialog'

export default <>
    <ListAction
        title='coreSync'
        icon='syncAlt'
        post='/accounts/user/syncAll'
        notApplicableToItems
        superAdmin
    />
    <ListAction
        title='accountsForPerson'
        icon='personAdd'
        dialog={CreateUserForPersonDialog}
    />
</>
