import { url } from 'app'
import {
    Checks,
    DialogForm,
} from 'form'

export default ({
    item,
    reloadItem,
    ...rest
}) => {

    const inputs = <>
        <Checks
            checkedItemsUrl={`/accounts/user/assignedRoles?id=${item.id || ''}`}
            choose={item => item.name}
            itemsUrl='/accounts/user/roles'
            property='roles'
            show={item => item.name}
        />
    </>

    const apiUrl = url({
        path: '/accounts/user/assignRoles',
        query: {
            id: item.id
        }
    })

    return <DialogForm
        {...rest}
        disableAutomaticItemLoading

        inputs={inputs}
        submitTo={apiUrl}
        title='accountsManageRoles'
    />
}
