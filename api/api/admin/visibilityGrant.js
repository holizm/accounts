import {
    read,
    write,
} from 'core'
import { assertVisibilityAdministrator } from 'accountsBusiness'
const authorize = action => async params => {
    assertVisibilityAdministrator()
    return await action(params)
}
export default Object.fromEntries(Object.entries({
    ...read,
    ...write
}).map(([name, action]) => [name, authorize(action)]))
