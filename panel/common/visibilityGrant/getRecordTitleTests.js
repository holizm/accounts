import assert from 'assert/strict'
import { registerHooks } from 'module'
import test from 'node:test'
registerHooks({
    load: (url, context, nextLoad) => {
        if (url !== 'test:recordDisplay') return nextLoad(url, context)
        const result = {
            format: 'module',
            shortCircuit: true,
            source: 'export const defaultDisplay = item => item?.title || item?.name || item?.id'
        }
        return result
    },
    resolve: (specifier, context, nextResolve) => {
        if (specifier !== 'app') return nextResolve(specifier, context)
        const result = {
            shortCircuit: true,
            url: 'test:recordDisplay'
        }
        return result
    }
})
const { default: getRecordTitle } = await import('./getRecordTitle.js')
test('access pickers show readable property, employee and room labels', () => {
    assert.equal(getRecordTitle({ title: 'Valiasr workshop' }), 'Valiasr workshop')
    assert.equal(getRecordTitle({ username: 'reza' }), 'reza')
    assert.equal(getRecordTitle({ number: 204 }), '204')
    assert.equal(getRecordTitle({ number: 0 }), '0')
    assert.equal(getRecordTitle(null), undefined)
})
