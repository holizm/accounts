import { read } from 'core'
import syncUsers from '../../business/user/syncUsers.js'

export default {
    ...read,
    syncAllOnPost: syncUsers
}
