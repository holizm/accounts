import {
    useEffect,
    useRef,
    useState,
} from 'react'
import { get } from 'app'
import {
    Browse,
    Select,
} from 'form'
import {
    useMessage,
    useScopedTranslation,
} from 'hooks'
import getRecordTitle from './getRecordTitle'
import headers from './recordHeaders'
import row from './recordRow'

export default ({
    onChange,
    property,
}) => {
    const [application, setApplication] = useState({})
    const [part, setPart] = useState('')
    const [type, setType] = useState('')
    const { error } = useMessage()
    const errorRef = useRef(error)
    errorRef.current = error
    const t = useScopedTranslation()
    useEffect(() => {
        let active = true
        void get('/app').then(value => active && setApplication(value), e => errorRef.current(e))
        return () => { active = false }
    }, [])
    const parts = Object.keys(application).filter(name => name !== 'rest').map(id => {
        const option = {
            id,
            title: t(id, id),
        }
        return option
    })
    const types = Object.entries(application[part] || {})
        .filter(([name, definition]) => name !== 'rest' && !definition.rest?.enum)
        .map(([id]) => {
            const option = {
                id,
                title: t(id, part),
            }
            return option
        })
    return <>
        <Select
            doNotSubmit
            onChange={value => {
                setPart(value)
                setType('')
                onChange?.('', null)
                return true
            }}
            options={parts}
            placeholder='part'
            property={`${property}Part`}
        />
        <Select
            doNotSubmit
            key={part}
            onChange={value => {
                setType(value)
                onChange?.('', null)
                return true
            }}
            options={types}
            placeholder='type'
            property={`${property}Type`}
        />
        {part && type && <Browse
            display={getRecordTitle}
            headers={headers}
            key={`${part}.${type}`}
            onChange={onChange}
            part={part}
            placeholder='item'
            property={property}
            required
            row={row}
            type={type}
        />}
    </>
}
