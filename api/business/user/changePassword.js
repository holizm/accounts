import { kcPut } from "../keycloak.js"

export const changePassword = async params => {
    const {
        password,
        user,
    } = params
    const parameters = {
        temporary: false,
        type: "password",
        value: password,
    }
    kcPut(`users/${user}/reset-password`, parameters, params)
}
