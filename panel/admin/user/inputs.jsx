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
            property='firstName'
            placeholder='firstName'
            required
        />
        <Text
            property='lastName'
            placeholder='lastName'
            required
        />
    </>

    const juridicalFields = <>
        <Text
            property='name'
            placeholder='name'
            required
        />
    </>

    return <>
        <Text
            property='username'
            placeholder='userName'
            required
            dir='ltr'
            startIcon={icons.accountCircle}
        />
        <Email
            property='email'
            placeholder='email'
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
