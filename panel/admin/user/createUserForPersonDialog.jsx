import {
    DialogForm,
    Text,
} from 'form'
import { ContactsPersonField } from 'contacts'

export default () => {

    const inputs = <>
        <ContactsPersonField property='person' />
        <Text
            placeholder='userName'
            username
        />
    </>

    return <DialogForm
        inputs={inputs}
        submitTo='/accounts/user/createForPerson'
        title='createUserForPerson'
    />
}
