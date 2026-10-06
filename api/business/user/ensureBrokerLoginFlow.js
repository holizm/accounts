import { clientError } from 'core'
import {
    iamGet,
    iamPost,
    iamPut,
} from '../iam.js'

export default async options => {
    const alias = 'supportAccessOnly'
    let flows = await iamGet('authentication/flows', options)
    if (!flows.some(flow => flow.alias === alias)) {
        await iamPost('authentication/flows', {
            alias,
            builtIn: false,
            providerId: 'basic-flow',
            topLevel: true,
        }, options)
    }
    const path = `authentication/flows/${alias}/executions`
    let executions = await iamGet(path, options)
    if (!executions.length) {
        await iamPost(`${path}/execution`, { provider: 'deny-access-authenticator' }, options)
        executions = await iamGet(path, options)
        const execution = executions[0]
        if (!execution || execution.providerId !== 'deny-access-authenticator') clientError('invalidRequest')
        await iamPut(path, {
            id: execution.id,
            requirement: 'REQUIRED',
        }, options)
        executions = await iamGet(path, options)
    }
    if (executions.length !== 1 || executions[0].providerId !== 'deny-access-authenticator' ||
        executions[0].requirement !== 'REQUIRED') clientError('invalidRequest')
    return alias
}
