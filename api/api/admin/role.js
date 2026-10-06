import { read } from 'core'
import {
    getRoleOptions,
    upsertAll,
} from 'accountsBusiness'

export default {
    ...read,
    all: getRoleOptions,
    upsertAllOnPost: upsertAll,
}
