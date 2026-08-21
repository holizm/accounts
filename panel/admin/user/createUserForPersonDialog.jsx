import {
    DialogForm,
    Text,
} from 'form'
import { ContactsPersonField } from 'contacts'

export default () => {

    const inputs = <>
        <ContactsPersonField
            property='person'
        />
        <Text
            property='username'
            placeholder='accountsUserName'
        />
    </>

    return <DialogForm
        title='accountsCreateUserForPerson'
        inputs={inputs}
        submitTo='/accounts/user/createForPerson'
    />
}
