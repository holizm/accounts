import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'
import fixtures from '../visibilityFixturesTests.js'
const fixture = await fixtures()
const providers = { visibilityAccess: { manage: false } }
mock.module('core', {
    namedExports: {
        clientError: fixture.clientError,
        providers
    }
})
const { default: authorize } = await import('./assertVisibilityAdministrator.js')
test('administrative metadata access requires the server-derived visibility privilege', () => {
    assert.throws(authorize, e => e.code === 'forbidden')
    providers.visibilityAccess.manage = true
    assert.doesNotThrow(authorize)
})
