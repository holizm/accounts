import icons from 'icons'
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
            firstName
            required
        />
        <Text
            lastName
            required
        />
    </>

    const juridicalFields = <>
        <Text
            name
            required
        />
    </>

    return <>
        <Text
            dir='ltr'
            placeholder='userName'
            required
            startIcon={icons.accountCircle}
            username
        />
        <Email
            email
            required
        />
        {
            typeof personType === 'string'
                ?
                personType === 'juridical'
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
