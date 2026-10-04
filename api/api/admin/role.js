import { read } from 'core'
import { upsertAll } from 'accountsBusiness'

export default {
    ...read,
    upsertAllOnPost: upsertAll,
}
