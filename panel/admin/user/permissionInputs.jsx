import { useContext } from 'react'
import { FormContext } from 'contexts'
import { useScopedTranslation } from 'hooks'
import PermissionGroup from './permissionGroup'

export default () => {
    const { currentItem } = useContext(FormContext)
    const t = useScopedTranslation()
    if (!currentItem?.hasPermissionGroups) return <div className='permissionStatus'>
        {
            t('partsDiscoverApiActions')
        }
    </div>
    return <div className='permissions'>
        <p>
            {
                t('permissionHelp')
            }
        </p>
        {
            currentItem.permissionGroups.map(group => <PermissionGroup
                {...group}
                key={group.title}
            />)
        }
    </div>
}
