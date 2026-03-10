import {
    DialogForm,
    Text,
} from 'form'
import { ContactsPersonField } from 'contacts'

export default () => {

    const inputs = <>
        <ContactsPersonField
            property='personUuid'
        />
        <Text
            property='userName'
            placeholder='accountsUserName'
        />
    </>

    return <DialogForm
        title='accountsCreateUserForPerson'
        inputs={inputs}
        submitTo='/adminUser/createForPerson'
    />
}
