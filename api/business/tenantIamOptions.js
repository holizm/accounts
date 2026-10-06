const tenantConfigurationKey = Symbol('tenantConfiguration')

export const createTenantIamOptions = tenantConfiguration => {
    const options = { [tenantConfigurationKey]: tenantConfiguration }
    return options
}

export const getTenantIamConfiguration = options => options?.[tenantConfigurationKey]
