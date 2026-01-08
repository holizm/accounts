import { Browse } from 'form'
import filters from "./filters"
import headers from "./headers"
import row from "./row"

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

        filters={filters}
        headers={headers}
        placeholder={placeholder ?? "AccountsUser"}
        property={property ?? "UserGuid"}
        row={row}
        show={item => item.userName || item.naturalPersonName}
        {...rest}
    />
}
