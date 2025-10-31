import { post } from "App"
import {
    DialogForm,
    Password,
} from "Form"

const inputs = <>
    <Password
        confirm
        confirmationPlaceholder="AccountsPasswordConfirmation"
        placeholder="AccountsPassword"
        property="Password"
    />
</>

const ChangePasswordDialog = ({
    entity,
    reloadEntity,
}) => {
    const changePassword = ({
        data,
        error,
        setProgress,
        success,
    }) => {
        setProgress(true)
        post(`/adminUser/changePassword?personGuid=${entity.personGuid}`, data)
            .then(data => {
                setProgress(false)
                success("AccountsPasswordChanged")
                reloadEntity(entity)
            }, e => {
                setProgress(false)
                error(e)
            })
    }

    return <DialogForm
        entityType="AdminUser"
        inputs={inputs}
        okAction={changePassword}
        title="AccountsChangePassword"
    />
}

export default ChangePasswordDialog
