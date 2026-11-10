import createOperationEnvironment from 'core/testing/data/operations/operationEnvironmentProvider.js'
import createAccountRecord from './createAccountRecord.js'

export default async () => {
    const environment = await createOperationEnvironment()
    const actor = await environment.run(() => createAccountRecord({ environment, uuid: environment.actor }))
    const target = await environment.run(() => createAccountRecord({ environment }))
    const runAs = (user, perform) => environment.context.run(new Map([
        ...environment.store,
        ['user', user.uuid],
        ['identity', { roles: ['user'] }],
        ['visibilityAccess', { manage: false, scopes: [user.id], tenantWide: false }],
    ]), perform)
    const result = {
        ...environment,
        actor,
        close: async () => {
            await environment.run(async () => {
                for (const [part, type] of [['accounts', 'user'], ['contacts', 'person']]) {
                    await (await environment.collection(part, type)).deleteMany({ tenant: environment.tenant })
                }
            })
            await environment.close()
        },
        runAs,
        target,
    }
    return result
}
