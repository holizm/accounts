import { isDevOrSuperAdmin } from 'app'
import HeaderAction from "HeaderAction"

export default () => {

    return isDevOrSuperAdmin() && <HeaderAction
        icon="Security"
        post="/accounts/configure"
        title="AccountsConfigure"
    />
}
