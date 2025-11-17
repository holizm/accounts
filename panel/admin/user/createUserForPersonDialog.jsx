import {
    DialogForm,
    Text,
} from 'form'
import { PersonField } from "contacts"

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
