import { List } from 'list'
import {
    AccountsUserFilters,
    AccountsUserHeaders,
    AccountsUserPermissionsAction,
    AccountsUserRow,
    AccountsUserSorts,
} from 'accountsCommon'

export default <List
    filters={AccountsUserFilters}
    headers={AccountsUserHeaders}
    itemActions={AccountsUserPermissionsAction}
    row={AccountsUserRow}
    sorts={AccountsUserSorts}
/>
