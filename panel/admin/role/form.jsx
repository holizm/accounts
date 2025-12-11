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

export default () => {
    return <DialogForm
        title="Role"
        type="role"
        inputs={inputs}
    />
}
