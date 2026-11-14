import assert from 'assert/strict'
import { readFileSync } from 'fs'
import { registerHooks } from 'module'
import test from 'node:test'

const dependencies = new URL('../api/testing/application/propertyEnvironmentProvider.js', import.meta.url).href
const hooks = registerHooks({
    resolve: (specifier, context, nextResolve) => {
        if (['/casing.js', '/error.js', '/logger.js'].some(suffix => specifier.endsWith(suffix))) {
            const resolution = {
                shortCircuit: true,
                url: dependencies,
            }
            return resolution
        }
        if (specifier === 'inflection') {
            const resolution = nextResolve(specifier, {
                ...context,
                parentURL: new URL('../core/package.json', import.meta.url).href,
            })
            return resolution
        }
        return nextResolve(specifier, context)
    },
})
const { extractTypes } = await import('../api/core/application/type.js')
hooks.deregister()

test('account schema parses and keeps UUID uniqueness within each tenant', () => {
    const lines = readFileSync(new URL('./part', import.meta.url), 'utf8').split('\n')
    const types = extractTypes('accounts/part', lines)
    const user = types.find(type => type.name === 'user')
    assert.ok(user.indexes.some(index => index.unique && index.properties.includes('uuid') && index.properties.includes('tenant')))
})

test('customer schema parses and keeps person uniqueness within each tenant', () => {
    const lines = readFileSync(new URL('../customers/part', import.meta.url), 'utf8').split('\n')
    const types = extractTypes('customers/part', lines)
    const customer = types.find(type => type.name === 'customer')
    assert.ok(customer.indexes.some(index => index.unique && index.properties.includes('person.id') && index.properties.includes('tenant')))
})
