import { iamGet } from '../iam.js'

export default async params => {
    const users = await iamGet('users', params)
    console.log(users)
}
