import { isDevOrSuperAdmin } from 'app'
import AppAction from "appAction"

export default () => {

    return isDevOrSuperAdmin() && <AppAction
        icon="Security"
        post="/accounts/configure"
        title="AccountsConfigure"
    />
}
