import { Browse } from 'form'
import filters from './filters'
import headers from './headers'
import row from './row'
import sorts from './sorts'

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
