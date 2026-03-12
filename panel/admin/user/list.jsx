import { post } from 'app'
import {
    DateTime,
    Image,
    List,
    ListAction,
    Text,
    ValueWithTitle,
} from 'list'
import UserForm from './form'
import ManageRoles from '../role/manage'
import AccountsUserChangePasswordAction from './changePasswordAction'
import CreateUserForPersonDialog from './createUserForPersonDialog'

const listActions = () => {

    const syncUsers = ({
        error,
        reloadList,
        setProgress,
        success,
    }) => {
        setProgress(true)
        post('/adminUser/syncAll').then(data => {
            reloadList()
            setProgress(false)
            success('coreDone')
        }, e => {
            setProgress(false)
            error(e)
        })
    }

    return <>
        <ListAction
            title='accountsSync'
            icon='syncAlt'
            onClick={params => syncUsers(params)}
            notApplicableToItems
            superAdmin
        />
        <ListAction
            title='accountsForPerson'
            icon='personAdd'
            dialog={CreateUserForPersonDialog}
        />
    </>
}

const filters = <>
    <Text
        property='userName'
        placeholder='accountsUserName'
    />
</>

const sorts = [
    {
        caption: 'AccountsUserNameAToZ',
        direction: 'asc',
        property: 'UserName',
    },
    {
        caption: 'AccountsUserNameZToA',
        property: 'UserName',
        direction: 'desc',
    }
]

const headers = <>
    <th></th>
    <th>accountsUserName</th>
    <th>accountsLastSyncDate</th>
</>

const row = item => <>
    <Image />
    <td>
        <ValueWithTitle
            value={item.userName}
            title={item.id}
        />
    </td>
    <DateTime
        date={item.lastSyncUtcDate}
    />
</>

const itemActions = item => <>
    {ManageRoles}
    <AccountsUserChangePasswordAction />
</>

export default <List
    create={UserForm}
    itemActions={itemActions}
    filters={filters}
    hasDelete
    headers={headers}
    listActions={listActions}
    row={row}
    sorts={sorts}
/>
