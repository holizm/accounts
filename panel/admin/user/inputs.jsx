import Icons from 'icons'
import {
    Email,
    Text,
} from 'form'
import { useDefaultPersonType } from "contactsCommon"

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
            placeholder="CoreName"
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
            placeholder="CoreEmail"
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
