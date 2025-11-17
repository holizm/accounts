import { url } from 'app'
import {
    Checks,
    DialogForm,
} from 'form'

const RolesDialog = ({
    entity,
    reloadEntity,
    ...rest
}) => {

    const inputs = <>
        <Checks
            checkedItemsUrl={`/role/assigned?userId=${entity.id || ""}`}
            choose={entity => entity.name}
            itemsUrl={`/role/all`}
            property="Roles"
            show={entity => entity.name}
        />
    </>

    const apiUrl = url({
        path: "/role/assign",
        query: {
            userId: entity.id
        }
    })

    return <DialogForm
        {...rest}
        disableAutomaticEntityLoading
        entityType="Role"
        inputs={inputs}
        submitTo={apiUrl}
        title="AccountsManageRoles"
    />
}

export default RolesDialog
