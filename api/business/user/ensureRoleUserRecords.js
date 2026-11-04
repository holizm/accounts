import {
    clientError,
    context,
    getCollection,
    getOrCreateAndGet,
} from 'core'

export default async ({
    account,
    candidate,
    existing,
    target,
    username,
}) => {
    const tenants = await getCollection('tenants', 'tenant')
    const tenantItem = await tenants.findOne({ id: target.tenant })
    if (!tenantItem) clientError('tenantResolutionFailed')
    await context.run(new Map([...context.getStore(), ['tenant', target.tenant], ['tenantItem', tenantItem], ['locale', 'shared']]), async () => {
        if (!existing) {
            await getOrCreateAndGet({
                part: 'accounts',
                query: {
                    $or: [{ person: candidate.person.id }, { 'person.id': candidate.person.id }],
                    tenant: target.tenant,
                },
                type: 'user',
            }, {
                body: {
                    contact: candidate.contact,
                    person: candidate.person,
                    username,
                    uuid: account.id,
                },
                locale: 'shared',
                part: 'accounts',
                type: 'user',
            })
        }
        await getOrCreateAndGet({
            part: 'tenants',
            query: {
                person: candidate.person.id,
                tenant: target.tenant,
            },
            type: 'tenantPerson',
        }, {
            body: {
                person: candidate.person.id,
                tenant: target.tenant,
            },
            locale: 'shared',
            part: 'tenants',
            type: 'tenantPerson',
        })
    })
}
