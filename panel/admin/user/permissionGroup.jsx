import PermissionField from './permissionField'

export default ({
    rows,
    title,
}) => <fieldset className='permissionGroup'>
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
