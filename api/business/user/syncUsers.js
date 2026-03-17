import { kcGet } from '../keycloak.js'

export default async params => {
    const users = await kcGet('users', params)
    console.log(users)
}
