import { post } from 'app'
import {
    DialogForm,
    Password,
} from 'form'

const inputs = <>
    <Password
        confirm
        confirmationPlaceholder='passwordConfirmation'
        password
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
        post(`/accounts/user/changePassword?uuid=${item.uuid}`, data)
            .then(data => {
                setProgress(false)
                success('passwordChanged')
                reloadItem(item)
            }, e => {
                setProgress(false)
                error(e)
            })
    }

    return <DialogForm
        inputs={inputs}
        okAction={changePassword}
        title='changePassword'
    />
}
