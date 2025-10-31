import { List } from "List"
import RoleForm from "./Form"

const headers = <>
    <th>Role Name</th>
</>

const row = entity => {
    return <>
        <td>
            {entity.name}
        </td>
    </>
}

const Roles = () => {
    return <List
        title="Roles"
        entityType="Role"
        headers={headers}
        row={row}
        create={RoleForm}
    />
}

export default Roles
