import assert from 'assert/strict'
import test from 'node:test'
import createAccountEnvironment from '../testing/business/user/createAccountEnvironment.js'

test('account lookup and private visibility keep the same identity when locale changes', async () => {
    const environment = await createAccountEnvironment()
    const { getUser } = await import('accountsBusiness')
    const { getUserGrantedVisibility } = await import('core')
    try {
        const canonicalId = await environment.generateId({ locale: 'en', meaning: 'canonical', part: 'accounts', tenant: environment.tenant, type: 'user' })
        const localizedId = await environment.generateId({ locale: 'fa', meaning: 'localized', part: 'accounts', tenant: environment.tenant, type: 'user' })
        await environment.run(async () => {
            const users = await environment.collection('accounts', 'user')
            await users.updateOne({ id: environment.actor.id }, { $set: { id: canonicalId, locale: 'en' } })
            await users.insertOne({ id: localizedId, locale: 'fa', part: 'accounts', person: environment.actor.person, tenant: environment.tenant, type: 'user', uuid: environment.actor.uuid })
            environment.actor.id = canonicalId
        })
        await environment.runAs(environment.actor, () => environment.context.run(new Map([
            ...environment.context.getStore(),
            ['locale', 'fa'],
        ]), async () => {
            const account = await getUser()
            const visibility = await getUserGrantedVisibility(environment.actor.uuid)
            assert.equal(account.id, canonicalId)
            assert.ok(visibility.scopes.includes(account.id))
            assert.notEqual(account.id, localizedId)
        }))
    }
    finally {
        await environment.close()
    }
})
