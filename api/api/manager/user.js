import { read } from 'core'
import {
    getPermissions,
    getUserList,
    previewPermissions,
    setPermissions,
} from 'accountsBusiness'

export default {
    ...read,
    list: getUserList,
    permissions: getPermissions,
    previewPermissionsOnPost: previewPermissions,
    setPermissionsOnPost: setPermissions,
}
