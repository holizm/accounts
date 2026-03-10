import { isDevOrSuperAdmin } from 'app'
import AppAction from 'appAction'

export default () => {

    return isDevOrSuperAdmin() && <AppAction
        icon='security'
        post='/accounts/configure'
        title='accountsConfigure'
    />
}
