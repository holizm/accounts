import { useState } from 'react'
import { Hidden } from 'form'
import { AccountsVisibilityGrantRecordPicker as RecordPicker } from 'accountsCommon'
import ScopeSelection from './scopeSelection'

export default () => {
    const [record, setRecord] = useState('')
    return <>
        <Hidden
            property='record'
            value={record}
        />
        <RecordPicker
            onChange={value => setRecord(value)}
            property='selectedRecord'
        />
        {record && <ScopeSelection record={record} />}
    </>
}
