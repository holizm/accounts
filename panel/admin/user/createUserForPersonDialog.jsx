import {
    DialogForm,
    Text,
} from 'form'
import { ContactsPersonField } from "contacts"

export default () => {

    const inputs = <>
        <ContactsPersonField
            property="personGuid"
        />
        <Text
            property="userName"
            placeholder="accountsUserName"
        />
    </>

    return <DialogForm
        title="AccountsCreateUserForPerson"
        inputs={inputs}
        submitTo="/adminUser/createForPerson"
    />
}
