import { Browse } from 'form'
import {
    AccountsUserFilters as filters,
    AccountsUserHeaders as headers,
    AccountsUserRow as row,
    AccountsUserSorts as sorts,
} from 'accountsCommon'

export default ({
    choose,
    placeholder,
    property,
    ...rest
}) => <Browse
    choose={choose}
    display={item => item.username || item.naturalPersonName}
    filters={filters}
    headers={headers}
    placeholder={placeholder ?? 'user'}
    property={property ?? 'userUuid'}
    row={row}
    sorts={sorts}
    {...rest}
/>
