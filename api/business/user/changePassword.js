import { iamPut } from '../iam.js'

export const changePassword = async params => {
    const {
        password,
        user,
    } = params
    const parameters = {
        temporary: false,
        type: 'password',
        value: password,
    }
    await iamPut(`users/${user}/reset-password`, parameters, params)
}
