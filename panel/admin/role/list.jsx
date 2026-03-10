import { List } from 'list'
import Form from './form'

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

export default <List
    headers={headers}
    row={row}
    create={Form}
/>
