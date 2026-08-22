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
    const handleChoose = item => {
        if (choose) {
            return choose(item)
        }
        return item.id
    }
    return <Browse
        choose={item => handleChoose(item)}
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
