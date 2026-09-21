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
}) => {
    return <Browse
        choose={choose}
        display={item => item.username || item.naturalPersonName}
        filters={filters}
        headers={headers}
        placeholder={placeholder ?? 'accountsUser'}
        property={property ?? 'userUuid'}
        row={row}
        sorts={sorts}
        {...rest}
    />
}
