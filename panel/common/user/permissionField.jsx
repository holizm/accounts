import { useScopedTranslation } from 'hooks'
import { Select } from 'form'

export default ({
    apiRolesLabel,
    condition,
    effective,
    hidden,
    source,
    ...rest
}) => {
    const t = useScopedTranslation()
    return <fieldset
        className='permission'
        hidden={hidden}
    >
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
        <span className='effectivePermission'>
            {
                `${t(effective)} · ${t(source)}`
            }
        </span>
        <Select
            {...rest}
            placeholder='permission'
        />
    </fieldset>
}
