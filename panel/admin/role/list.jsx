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

export default () => {
    return <List
        title='roles'

        headers={headers}
        row={row}
        create={RoleForm}
    />
}
