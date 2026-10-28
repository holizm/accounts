import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
import fixtures from '../visibilityFixturesTests.js'
import getVisibilityVersion from '../user/getVisibilityVersion.js'
const fixture = await fixtures()
let write
let post
let hook
mock.module('../user/getVisibilityRecord.js', {
    defaultExport: async () => {
        const result = {
            id: fixture.ids.own,
            visibleTo: [fixture.ids.branchA]
        }
        return result
    }
})
mock.module('core', {
    namedExports: {
        callIfExists: async (path, params) => {
            hook = params
            if (params.item.visibleTo.includes(fixture.ids.user)) fixture.clientError('invalidRequest')
        },
        clientError: fixture.clientError,
        dbFindOneAndUpdate: async params => {
            write = params
            const result = {
                id: params.query.id,
                ...params.updateQuery.$set
            }
            return result
        },
        getPaths: () => ({ preUpsertion: 'typeHook' }),
        parseId: fixture.parseId,
        postWrite: async params => {
            post = params
        }
    }
})
const { setRecordVisibility } = await import('./setRecordVisibility.js')
test('metadata changes use the real type, compare existing visibility atomically, and synchronize references', async () => {
    const visibleTo = [fixture.ids.branchA, fixture.ids.branchB]
    const result = await setRecordVisibility({
        body: {
            part: 'accounts',
            record: fixture.ids.own,
            reviewVersion: getVisibilityVersion([fixture.ids.branchA]),
            tenant: 'tenantB',
            type: 'user',
            visibleTo
        }
    })
    assert.equal(write.part, 'tasks')
    assert.equal(write.type, 'task')
    assert.deepEqual(write.query.visibleTo, { $eq: [fixture.ids.branchA] })
    assert.deepEqual(write.updateQuery.$set, { visibleTo })
    assert.deepEqual(result.visibleTo, visibleTo)
    assert.equal(post.action, 'update')
    assert.equal(post.item.id, fixture.ids.own)
    assert.equal(hook.id, fixture.ids.own)
    assert.equal(hook.part, 'tasks')
})
test('domain ownership checks run before an atomic visibility change', async () => {
    write = null
    await assert.rejects(setRecordVisibility({
        body: {
            record: fixture.ids.own,
            reviewVersion: getVisibilityVersion([fixture.ids.branchA]),
            visibleTo: [fixture.ids.user],
        },
    }), e => e.code === 'invalidRequest')
    assert.equal(write, null)
})
test('a stale review version is rejected before any metadata update', async () => {
    write = null
    await assert.rejects(setRecordVisibility({
        body: {
            record: fixture.ids.own,
            reviewVersion: getVisibilityVersion([fixture.ids.branchB]),
            visibleTo: [fixture.ids.user]
        }
    }), e => e.code === 'invalidRequest')
    assert.equal(write, null)
})
