import { create } from 'core'
import ensureIamUser from './ensureIamUser.js'

export default async params => {
    const { item } = params
    await ensureIamUser(params)
    if (item.person) {
        return
    }
    const person = await create({
        ...params,
        part: 'contacts',
        type: 'person'
    })
    const { inherited, ...personData } = person
    item.contact = inherited
    item.person = personData
    if (params.phone) {
        await create({
            contact: inherited.id,
            default: true,
            number: params.phone,
            part: 'contacts',
            type: 'phone',
        })
    }
}
