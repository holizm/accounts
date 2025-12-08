import { url } from 'app'
import {
    Checks,
    DialogForm,
} from 'form'

const RolesDialog = ({
    item,
    reloadItem,
    ...rest
}) => {

    const inputs = <>
        <Checks
            checkedItemsUrl={`/role/assigned?userId=${item.id || ""}`}
            choose={item => item.name}
            itemsUrl={`/role/all`}
            property="Roles"
            show={item => item.name}
        />
    </>

    const apiUrl = url({
        path: "/role/assign",
        query: {
            userId: item.id
        }
    })

    return <DialogForm
        {...rest}
        disableAutomaticItemLoading
        type="Role"
        inputs={inputs}
        submitTo={apiUrl}
        title="AccountsManageRoles"
    />
}

export default RolesDialog
