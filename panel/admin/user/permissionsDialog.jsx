import { DialogForm } from 'form'
import PermissionInputs from './permissionInputs'

export default ({
    item,
    ...rest
}) => <DialogForm
    {...rest}
    inputs={<PermissionInputs />}
    itemLoadingUrl={`/accounts/user/permissions?id=${item.id}`}
    noMeaning
    submitTo='/accounts/user/setPermissions'
    title='permissions'
/>
