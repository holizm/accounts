import { List } from 'list'
import RoleForm from "./form"

const headers = <>
    <th>role Name</th>
</>

const row = item => {
    return <>
        <td>
            {item.name}
        </td>
    </>
}

const Roles = () => {
    return <List
        title="Roles"
        type="Role"
        headers={headers}
        row={row}
        create={RoleForm}
    />
}

export default Roles
