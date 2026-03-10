import { useState } from 'react'
import { DialogContext } from 'contexts'
import { ListAction } from 'list'
import {
    DialogForm
} from 'form'
import UserField from './field'

export default props => {

    const [open, setOpen] = useState(false)

    const inputs = <>
        <UserField
            choose={i => i.personUuid}
            property='person'
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
            title='accountsAddFromUsers'
            icon='peopleAlt'
            onClick={() => setOpen(true)}
        />
    </DialogContext.Provider>
}
