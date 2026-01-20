import {
    DialogForm,
    Text,
} from 'form'

const inputs = <>
    <Text
        property='name'
        required
        dir="ltr"
    />
</>

export default () => {
    return <DialogForm
        inputs={inputs}
    />
}
