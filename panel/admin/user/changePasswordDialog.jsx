import { post } from 'app'
import {
    DialogForm,
    Password,
} from 'form'

const inputs = <>
    <Password
        confirm
        confirmationPlaceholder='AccountsPasswordConfirmation'
        placeholder='accountsPassword'
        property='password'
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
        post(`/adminUser/changePassword?personUuid=${item.personUuid}`, data)
            .then(data => {
                setProgress(false)
                success('accountsPasswordChanged')
                reloadItem(item)
            }, e => {
                setProgress(false)
                error(e)
            })
    }

    return <DialogForm

        inputs={inputs}
        okAction={changePassword}
        title='accountsChangePassword'
    />
}
