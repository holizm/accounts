import { useContext } from 'react'
import { ItemContext } from 'contexts'
import { ItemAction } from 'list'
import { AccountsUserPermissionsDialog as PermissionsDialog } from 'accountsCommon'

export default () => {
    const { item } = useContext(ItemContext)
    if (!item?.canManagePermissions) return null
    return <ItemAction
        dialog={PermissionsDialog}
        icon='adminPanelSettings'
        title='permissions'
    />
}
