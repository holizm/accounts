import { iamDelete } from '../iam.js'

export default async item => {
    if (item.uuid) {
        await iamDelete(`users/${item.uuid}`, null, item)
    }
}
