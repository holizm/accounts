import Icons from "Icons"
import {
    Email,
    Text,
} from "Form"
import { useDefaultPersonType } from "ContactsCommon"

const UserInputs = personType => {

    const defaultPersonType = useDefaultPersonType()
    const { isJuridical, isNatural } = defaultPersonType

    const naturalFields = <>
        <Text
            property="FirstName"
            placeholder="AccountsFirstName"
            required
        />
        <Text
            property="LastName"
            placeholder="AccountsLastName"
            required
        />
    </>

    const juridicalFields = <>
        <Text
            property="Name"
            placeholder="InfraName"
            required
        />
    </>

    return <>
        <Text
            property="UserName"
            placeholder="AccountsUserName"
            required
            dir="ltr"
            startIcon={Icons.AccountCircle}
        />
        <Email
            property="Email"
            placeholder="InfraEmail"
            required
        />
        {
            typeof personType === "string"
                ?
                personType === "Juridical"
                    ?
                    juridicalFields
                    :
                    naturalFields

                :
                isJuridical
                    ?
                    juridicalFields
                    :
                    naturalFields
        }
    </>
}

export default UserInputs
