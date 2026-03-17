import { List } from 'list'
import form from './form'
import headers from './headers'
import itemActions from './itemActions'
import listActions from './listActions'
import row from './row'
import sorts from './sorts'

export default <List
    create={form}
    itemActions={itemActions}
    hasDelete
    headers={headers}
    listActions={listActions}
    row={row}
    sorts={sorts}
/>
