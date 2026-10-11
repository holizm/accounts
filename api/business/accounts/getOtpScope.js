import { getTenant } from 'core'

export default ({ host, phone }) => {
    const scope = {
        item: phone,
        part: 'accounts',
        tenant: getTenant(host).id,
        type: 'otp',
    }
    return scope
}
