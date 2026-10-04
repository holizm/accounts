import { Select } from 'form'

export default ({
    apiRolesLabel,
    condition,
    ...rest
}) => <fieldset className='permission'>
    <legend>
        {
            condition
        }
    </legend>
    <span className='apiRoles'>
        {
            apiRolesLabel
        }
    </span>
    <Select
        {...rest}
        placeholder='permission'
    />
</fieldset>
