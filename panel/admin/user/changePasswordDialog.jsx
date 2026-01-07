import { post } from 'app'
import {
    DialogForm,
    Password,
} from 'form'

const inputs = <>
    <Password
        confirm
        confirmationPlaceholder="AccountsPasswordConfirmation"
        placeholder="accountsPassword"
        property="password"
    />
</>

export default ({
    item,
    reloadItem,
}) => {
    const changePassword = ({
        data,
        error,
        setProgress,
        success,
    }) => {
        setProgress(true)
        post(`/adminUser/changePassword?personGuid=${item.personGuid}`, data)
            .then(data => {
                setProgress(false)
                success("AccountsPasswordChanged")
                reloadItem(item)
            }, e => {
                setProgress(false)
                error(e)
            })
    }

    return <DialogForm
        type="AdminUser"
        inputs={inputs}
        okAction={changePassword}
        title='accountsChangePassword'
    />
}
