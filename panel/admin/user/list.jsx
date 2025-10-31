import { post } from "App"
import {
    DateTime,
    Image,
    List,
    ListAction,
    Text,
    ValueWithTitle,
} from "List"
import UserForm from "./Form"
import ManageRoles from "../Role/Manage"
import ChangePasswordAction from "./ChangePasswordAction"
import CreateUserForPersonDialog from "./CreateUserForPersonDialog"

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
