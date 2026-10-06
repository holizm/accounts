import {
    useContext,
    useEffect,
    useState,
} from 'react'
import { get } from 'app'
import { FormContext } from 'contexts'
import {
    useDebounce,
    useMessage,
    useScopedTranslation,
} from 'hooks'
import { AccountsUserPermissionGroup as PermissionGroup } from 'accountsCommon'
import { AccountsUserPermissionStatus as PermissionStatus } from 'accountsCommon'

export default () => {
    const { currentItem } = useContext(FormContext)
    const t = useScopedTranslation()
    const { error } = useMessage()
    const [search, setSearch] = useState('')
    const [catalog, setCatalog] = useState(null)
    const term = useDebounce(search)
    useEffect(() => {
        if (!currentItem?.id) return
        let active = true
        const query = new URLSearchParams({
            id: currentItem.id,
            search: term,
        })
        void get(`/accounts/user/permissions?${query}`).then(data => {
            if (active) setCatalog(data)
        }, e => {
            if (active) error(e)
        })
        return () => { active = false }
    }, [currentItem?.id, term])
    const data = catalog || currentItem
    return <div className='permissions'>
        <input
            aria-label={t('coreSearch')}
            className='permissionSearch'
            onChange={event => setSearch(event.target.value)}
            placeholder={t('coreSearch')}
            type='search'
            value={search}
        />
        <PermissionStatus {...data} />
        <p>
            {
                t('permissionHelp')
            }
        </p>
        {
            data?.permissionGroups?.map(group => <PermissionGroup
                {...group}
                key={group.title}
            />)
        }
    </div>
}
