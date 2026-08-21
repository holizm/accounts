import { createOnPost } from 'core'
import ensureIamUser from './ensureIamUser.js'

export default async params => {
    const {
        defaultPersonType,
        item,
    } = params
    await ensureIamUser(params)
    if (item.person) {
        return
    }
    const personType =
        defaultPersonType === 'juridical'
        ?
        'juridicalPerson'
        :
        'naturalPerson'
    const person = await createOnPost({
        ...params,
        part: 'contacts',
        type: personType,
    })
    const { inherited, ...personData } = person
    item.contact = inherited
    item.person = personData
}
