import { createOnPost } from 'core'
import ensureIamUser from './ensureIamUser.js'

export default async params => {
    const { item } = params
    await ensureIamUser(params)
    if (item.person) {
        return
    }
    const person = await createOnPost({
        ...params,
        part: 'contacts',
        type: 'person'
    })
    const { inherited, ...personData } = person
    item.contact = inherited
    item.person = personData
}
