import {
    DialogForm,
    Text,
} from 'form'

const inputs = <>
    <Text
        property="Name"
        required
        dir="ltr"
    />
</>

const RoleForm = () => {
    return <DialogForm
        title="Role"
        type="role"
        inputs={inputs}
    />
}

export default RoleForm
