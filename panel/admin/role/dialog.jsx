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
            checkedItemsUrl={`/role/assigned?userId=${item.id || ''}`}
            choose={item => item.name}
            itemsUrl={`/role/all`}
            property='roles'
            show={item => item.name}
        />
    </>

    const apiUrl = url({
        path: '/role/assign',
        query: {
            userId: item.id
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
