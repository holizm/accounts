import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
import fixtures from '../visibilityFixturesTests.js'
const fixture = await fixtures()
mock.module('core', {
    namedExports: {
        clientError: fixture.clientError,
        dbItem: async params => params.id === fixture.ids.user || params.id === fixture.ids.branchA ? { id: params.id } : null,
        parseId: fixture.parseId,
        providers: {
            tenant: 'tenantA',
            tenantGroups: []
        }
    }
})
const { default: validate } = await import('./validate.js')
test('a grant must target a real local user and either an existing scope or explicit tenant-wide access', async () => {
    await validate({
        item: fixture.ids.branchA,
        user: fixture.ids.user
    })
    await validate({
        tenantWide: true,
        user: fixture.ids.user
    })
    for (const item of [{
        item: fixture.ids.foreign,
        user: fixture.ids.user
    }, { user: fixture.ids.user }, {
        item: fixture.ids.branchA,
        tenantWide: true,
        user: fixture.ids.user
    }, {
        item: fixture.ids.branchA,
        user: fixture.ids.foreign
    }]) await assert.rejects(validate(item), e => e.code === 'invalidRequest')
})
