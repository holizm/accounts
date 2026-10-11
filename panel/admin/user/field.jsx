import { Browse } from 'form'
import {
    AccountsUserFilters as filters,
    AccountsUserHeaders as headers,
    AccountsUserRow as row,
    AccountsUserSorts as sorts,
} from 'accountsCommon'

export default props => <Browse
    {...props}
    display={item => item.username || item.naturalPersonName}
    filters={filters}
    headers={headers}
    placeholder={props.placeholder ?? 'user'}
    property={props.property ?? 'userUuid'}
    row={row}
    sorts={sorts}
/>
