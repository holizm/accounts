import { post } from 'app'
import {
    DateTime,
    Image,
    List,
    ListAction,
    Text,
    ValueWithTitle,
} from 'list'
import UserForm from "./form"
import ManageRoles from "../role/manage"
import ChangePasswordAction from "./changePasswordAction"
import CreateUserForPersonDialog from "./createUserForPersonDialog"

const listActions = () => {

    const syncUsers = ({
        error,
        reloadList,
        setProgress,
        success,
    }) => {
        setProgress(true)
        post("/adminUser/syncAll").then(data => {
            reloadList()
            setProgress(false)
            success("InfraDone")
        }, e => {
            setProgress(false)
            error(e)
        })
    }

    return <>
        <ListAction
            title="AccountsSync"
            icon="SyncAlt"
            onClick={params => syncUsers(params)}
            notApplicableToEntities
            superAdmin
        />
        <ListAction
            title="AccountsForPerson"
            icon="PersonAdd"
            dialog={CreateUserForPersonDialog}
        />
    </>
}

const filters = <>
    <Text
        property="UserName"
        placeholder="AccountsUserName"
    />
</>

const sorts = [
    {
        caption: "AccountsUserNameAToZ",
        direction: "asc",
        property: "UserName",
    },
    {
        caption: "AccountsUserNameZToA",
        property: "UserName",
        direction: "desc",
    }
]

const headers = <>
    <th></th>
    <th>AccountsUserName</th>
    <th>AccountsLastSyncDate</th>
</>

const row = entity => <>
    <Image />
    <td>
        <ValueWithTitle
            value={entity.userName}
            title={entity.guid}
        />
    </td>
    <DateTime
        date={entity.lastSyncUtcDate}
    />
</>

const entityActions = entity => <>
    {ManageRoles}
    <ChangePasswordAction />
</>

const Users = () => {
    return <List
        create={UserForm}
        entityActions={entityActions}
        entityType="AdminUser"
        filters={filters}
        hasDelete
        headers={headers}
        listActions={listActions}
        row={row}
        sorts={sorts}
        title="AccountsUsers"
    />
}

export default Users
