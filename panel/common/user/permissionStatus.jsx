import { useScopedTranslation } from 'hooks'

export default ({ hasPermissionGroups }) => {
    const t = useScopedTranslation()
    if (hasPermissionGroups !== false) return null
    return <div className='permissionStatus'>
        {
            t('coreNoItemsFound')
        }
    </div>
}
