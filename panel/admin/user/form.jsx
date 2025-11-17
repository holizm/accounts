const stack = new Error()
    .stack
    .split("\n")
    .filter(i => !/^.*(\.vite|\.main\.jsx).*/.test(i))
    .join("\n")
console.log(stack)

import { DialogForm } from 'form'
import UserInputs from "./Inputs"

const UserForm = () => {
    const stack = new Error()
        .stack
        .split("\n")
        .filter(i => !/^.*(\.vite|\.main\.jsx).*/.test(i))
        .join("\n")
    console.log(stack)
    return <DialogForm
        entityType="AdminUser"
        humanReadableEntityType="AccountsUser"
        inputs={UserInputs()}
    />
}

export default UserForm
