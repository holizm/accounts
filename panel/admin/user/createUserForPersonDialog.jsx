import {
    DialogForm,
    Text,
} from "Form"
import { PersonField } from "Contacts"

const CreateUserForPersonDialog = () => {

    const inputs = <>
        <PersonField
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

export default CreateUserForPersonDialog
