import { serverError } from 'core'
import getIamRealm from '../getIamRealm.js'
import {
    iamGet,
    iamPut,
} from '../iam.js'

const pending = new Map()
const configure = async options => {
    const profile = await iamGet('users/profile', options)
    if (!Array.isArray(profile?.attributes)) serverError('coreApiRoleAccessFailed')
    let changed = false
    for (const name of ['person', 'tenant']) {
        let attribute = profile.attributes.find(item => item.name === name)
        if (!attribute) {
            attribute = { name }
            profile.attributes.push(attribute)
            changed = true
        }
        const permissions = {
            edit: ['admin'],
            view: ['admin'],
        }
        if (JSON.stringify(attribute.permissions) !== JSON.stringify(permissions)) {
            attribute.permissions = permissions
            changed = true
        }
    }
    if (changed) await iamPut('users/profile', profile, options)
    const verified = await iamGet('users/profile', options)
    for (const name of ['person', 'tenant']) {
        const permissions = verified?.attributes?.find(item => item.name === name)?.permissions
        if (permissions?.edit?.length !== 1 || permissions.edit[0] !== 'admin' || permissions?.view?.length !== 1 || permissions.view[0] !== 'admin') serverError('coreApiRoleAccessFailed')
    }
}

export default async options => {
    const {
        baseUrl,
        realm,
    } = await getIamRealm(options)
    const key = `${baseUrl}/${realm}`
    if (!pending.has(key)) pending.set(key, configure(options))
    try {
        await pending.get(key)
    }
    catch (e) {
        pending.delete(key)
        throw e
    }
}
