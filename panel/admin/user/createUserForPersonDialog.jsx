import {
    DialogForm,
    Text,
} from 'form'
import { ContactsPersonField } from "contacts"

export default () => {

    const inputs = <>
        <ContactsPersonField
            property="PersonGuid"
        />
        <Text
            property="UserName"
            placeholder="AccountsUserName"
        />
    </>

    return <DialogForm
        title="AccountsCreateUserForPerson"
        inputs={inputs}
        submitTo="/adminUser/createForPerson"
    />
}
