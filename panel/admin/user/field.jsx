import { Browse } from "Form"
import filters from "./Filters"
import headers from "./Headers"
import row from "./Row"

const UserField = ({
    choose,
    placeholder,
    property,
    ...rest
}) => {
    const handleChoose = entity => {
        if (choose) {
            return choose(entity)
        }
        return entity.id
    }
    return <Browse
        choose={entity => handleChoose(entity)}
        entityType="User"
        filters={filters}
        headers={headers}
        placeholder={placeholder ?? "AccountsUser"}
        property={property ?? "UserGuid"}
        row={row}
        show={entity => entity.userName || entity.naturalPersonName}
        {...rest}
    />
}

export default UserField
