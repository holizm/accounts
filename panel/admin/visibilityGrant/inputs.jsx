import { useState } from 'react'
import {
    Check,
    Lookup,
} from 'form'
import { AccountsVisibilityGrantRecordPicker as RecordPicker } from 'accountsCommon'

export default () => {
    const [tenantWide, setTenantWide] = useState(false)
    return <>
        <Lookup
            part='accounts'
            property='user'
            required
            type='user'
        />
        <Check
            onChange={value => {
                setTenantWide(value)
                return true
            }}
            placeholder='allRecords'
            property='tenantWide'
        />
        {!tenantWide && <RecordPicker property='item' />}
    </>
}
