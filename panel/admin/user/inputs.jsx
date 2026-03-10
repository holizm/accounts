import Icons from 'icons'
import {
    Email,
    Text,
} from 'form'
import { useContactsHooksUseDefaultPersonType } from 'contacts'

export default personType => {

    const defaultPersonType = useContactsHooksUseDefaultPersonType()
    const { isJuridical, isNatural } = defaultPersonType

    const naturalFields = <>
        <Text
            property='firstName'
            placeholder='accountsFirstName'
            required
        />
        <Text
            property='lastName'
            placeholder='accountsLastName'
            required
        />
    </>

    const juridicalFields = <>
        <Text
            property='name'
            placeholder='coreName'
            required
        />
    </>

    return <>
        <Text
            property='userName'
            placeholder='accountsUserName'
            required
            dir='ltr'
            startIcon={Icons.AccountCircle}
        />
        <Email
            property='email'
            placeholder='coreEmail'
            required
        />
        {
            typeof personType === 'string'
                ?
                personType === 'Juridical'
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
