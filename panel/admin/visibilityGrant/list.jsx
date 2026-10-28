import { List } from 'list'
import form from './form'
import headers from './headers'
import row from './row'

export default <List
    create={form}
    hasDelete
    headers={headers}
    row={row}
    title='visibilityGrants'
/>
