import {
    clientError,
    providers,
} from 'core'
export default () => {
    if (!providers.visibilityAccess?.manage) clientError('forbidden')
}
