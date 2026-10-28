import {
    useEffect,
    useRef,
    useState,
} from 'react'
import { get } from 'app'
import { Hidden } from 'form'
import {
    useMessage,
    useScopedTranslation,
} from 'hooks'
import { AccountsVisibilityGrantRecordPicker as RecordPicker } from 'accountsCommon'
import getRecordTitle from '../../common/visibilityGrant/getRecordTitle'

export default ({ record }) => {
    const [scopes, setScopes] = useState([])
    const [loadedRecord, setLoadedRecord] = useState('')
    const [reviewVersion, setReviewVersion] = useState('')
    const { error } = useMessage()
    const errorRef = useRef(error)
    errorRef.current = error
    const t = useScopedTranslation()
    useEffect(() => {
        setScopes([])
        setLoadedRecord('')
        if (!record) return
        let active = true
        void get(`/accounts/recordVisibility?record=${encodeURIComponent(record)}`).then(value => {
            if (active) {
                setScopes(value.scopes)
                setReviewVersion(value.reviewVersion)
                setLoadedRecord(record)
            }
        }, e => errorRef.current(e))
        return () => { active = false }
    }, [record])
    if (loadedRecord !== record) return <div>{t('loading')}</div>
    return <>
        <Hidden
            property='reviewVersion'
            value={reviewVersion}
        />
        <Hidden
            property='visibleTo'
            value={scopes.map(scope => scope.id)}
        />
        <div>{t('visibleTo')}</div>
        <ul>
            {scopes.map(scope => <li key={scope.id}>
                <span>{scope.title}</span>
                <button
                    onClick={() => setScopes(current => current.filter(item => item.id !== scope.id))}
                    type='button'
                >
                    {t('delete')}
                </button>
            </li>)}
        </ul>
        <RecordPicker
            key={`${record}.${scopes.length}`}
            onChange={(id, item) => {
                if (!id || scopes.some(scope => scope.id === id)) return
                setScopes(current => [...current, {
                    id,
                    title: getRecordTitle(item),
                }])
            }}
            property='selectedScope'
        />
    </>
}
