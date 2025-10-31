import {
    DialogForm,
    Text,
} from "Form"

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
        entityType="role"
        inputs={inputs}
    />
}

export default RoleForm
