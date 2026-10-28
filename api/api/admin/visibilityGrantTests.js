import assert from 'assert/strict'
import { readFileSync } from 'fs'
import {
    mock,
    test,
} from 'node:test'
let administrator = false
mock.module('core', {
    namedExports: {
        read: { list: async () => 'read' },
        write: { createOnPost: async () => 'write' }
    }
})
mock.module('accountsBusiness', {
    namedExports: {
        assertVisibilityAdministrator: () => {
            if (!administrator) throw new Error('forbidden')
        }
    }
})
const { default: actions } = await import('./visibilityGrant.js')
const access = JSON.parse(readFileSync(new URL('./access.json', import.meta.url)))
test('every exposed grant action has an administrative route policy and an operation guard', async () => {
    for (const action of Object.keys(actions)) {
        assert.ok(access.visibilityGrant[action].roles.includes('admin'))
        assert.ok(!access.visibilityGrant[action].roles.includes('manager'))
        await assert.rejects(actions[action]({}), /forbidden/)
    }
    administrator = true
    assert.equal(await actions.list({}), 'read')
    assert.equal(await actions.createOnPost({}), 'write')
})
