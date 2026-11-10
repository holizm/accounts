import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'

const providers = { tenant: 'tenant', user: 'actor' }
const reads = []
mock.module('core', { exports: {
    ensure: value => ({ satisfies: predicate => {
        if (!predicate(value)) throw new Error('invalidRequest')
    } }),
    getByFilter: async (params, query) => {
        reads.push({ params, query })
        const user = { id: 'canonicalAccount', uuid: query.uuid }
        return user
    },
    notFound: () => { throw new Error('notFound') },
    providers,
} })
const { getUser } = await import('./getUser.js')

test('current account lookup matches the tenant-wide canonical identity across locales', async () => {
    assert.equal((await getUser('victim')).uuid, 'actor')
    assert.equal(reads[0].params.acrossLocales, true)
    assert.deepEqual(reads[0].query, { tenant: 'tenant', uuid: 'actor' })
    providers.user = null
    await assert.rejects(getUser({ $ne: null }), /invalidRequest/)
})
