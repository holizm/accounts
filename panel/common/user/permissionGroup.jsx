import { AccountsUserPermissionField as PermissionField } from 'accountsCommon'

export default ({
    hidden,
    rows,
    title,
}) => <fieldset
    className='permissionGroup'
    hidden={hidden}
>
    <legend>
        {
            title
        }
    </legend>
    {
        rows.map(row => <PermissionField
            {...row}
            key={row.property}
        />)
    }
</fieldset>
