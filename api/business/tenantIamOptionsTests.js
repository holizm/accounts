import assert from 'assert/strict'
import test from 'node:test'
import {
    createTenantIamOptions,
    getTenantIamConfiguration,
} from './tenantIamOptions.js'

test('interleaved tenant requests retain their own IAM configuration', () => {
    const first = { realm: 'north' }
    const second = { realm: 'south' }
    const options = createTenantIamOptions(first)
    assert.equal(getTenantIamConfiguration(createTenantIamOptions(second)), second)
    assert.equal(getTenantIamConfiguration(options), first)
    assert.equal(getTenantIamConfiguration({ realm: 'north' }), undefined)
})
