const stack = new Error()
    .stack
    .split("\n")
    .filter(i => !/^.*(\.vite|\.main\.jsx).*/.test(i))
    .join("\n")
console.log(stack)

import { DialogForm } from 'form'
import UserInputs from "./inputs"

const UserForm = () => {
    const stack = new Error()
        .stack
        .split("\n")
        .filter(i => !/^.*(\.vite|\.main\.jsx).*/.test(i))
        .join("\n")
    console.log(stack)
    return <DialogForm
        type="AdminUser"
        humanReadableItemType="AccountsUser"
        inputs={UserInputs()}
    />
}

export default UserForm
