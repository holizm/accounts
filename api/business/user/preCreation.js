import { createOnPost } from 'core'

export default async params => {
    const {
        item
    } = params
    const person = await createOnPost({
        ...params,
        part: 'contacts',
        type: 'person',
    })
    const { inherited, ...personData } = person
    item.contact = inherited
    item.person = personData
}
