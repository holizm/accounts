import { useState } from "react"
import { DialogContext } from 'contexts'
import { ListAction } from 'list'
import {
    DialogForm
} from 'form'
import UserField from "./field"

const AddUserAction = props => {

    const [open, setOpen] = useState(false)

    const inputs = <>
        <UserField
            choose={i => i.personGuid}
            property="Person"
        />
        {
            props.inputs && props.inputs
        }
    </>

    return <DialogContext.Provider
        value={{
            open,
            setOpen
        }}
    >
        <DialogForm
            {...props}
            inputs={inputs}
        />
        <ListAction
            title="AccountsAddFromUsers"
            icon="PeopleAlt"
            onClick={() => setOpen(true)}
        />
    </DialogContext.Provider>
}

export default AddUserAction
