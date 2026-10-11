import { useState } from 'react'
import { DialogContext } from 'contexts'
import { ListAction } from 'list'
import { DialogForm } from 'form'
import UserField from './field'

export default props => {

    const [open, setOpen] = useState(false)
    const contextValue = {
        open,
        setOpen,
    }

    const inputs = <>
        <UserField
            choose={i => i.personUuid}
            property='person'
        />
        {
            props.inputs && props.inputs
        }
    </>

    return <DialogContext value={contextValue}>
        <DialogForm
            {...props}
            inputs={inputs}
        />
        <ListAction
            icon='peopleAlt'
            onClick={() => setOpen(true)}
            title='addFromUsers'
        />
    </DialogContext>
}
