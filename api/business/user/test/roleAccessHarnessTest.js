import { getTenantIamConfiguration } from '../../tenantIamOptions.js'

export default () => {
    const state = {
        clients: [],
        executions: [],
        flows: [],
        links: [],
        mappings: [{ id: 'existingRole', name: 'guest' }],
        posts: [],
        providers: [],
        user: null,
    }
    const sourceUser = {
        email: 'operator@example.test',
        emailVerified: true,
        enabled: true,
        id: 'actorUuid',
        username: 'operator',
    }
    const iamGet = async (path, options) => {
        if (path === 'users/actorUuid' && getTenantIamConfiguration(options).realm === 'source') return sourceUser
        if (path === 'identity-provider/instances') return state.providers
        if (path.startsWith('clients?')) return state.clients
        if (path.endsWith('/client-secret')) {
            const credentials = { value: 'testSecret' }
            return credentials
        }
        if (path === 'authentication/flows') return state.flows
        if (path.endsWith('/executions')) return state.executions
        if (path.startsWith('users?')) return state.user ? [state.user] : []
        if (path.endsWith('/federated-identity')) return state.links
        if (path === 'roles/manager') {
            const role = { id: 'managerRole', name: 'manager' }
            return role
        }
        if (path.endsWith('/role-mappings/realm')) return state.mappings
        throw new Error(path)
    }
    const iamPost = async (path, data, options) => {
        state.posts.push({
            data,
            path,
            realm: getTenantIamConfiguration(options).realm,
        })
        if (path === 'clients') state.clients.push({ ...data, id: 'brokerClient' })
        else if (path === 'authentication/flows') state.flows.push(data)
        else if (path.endsWith('/executions/execution')) state.executions.push({
            id: 'denyExecution',
            providerId: data.provider,
            requirement: 'DISABLED',
        })
        else if (path === 'identity-provider/instances') state.providers.push(data)
        else if (path === 'users') {
            state.user = { ...data, id: 'targetUuid' }
            state.links = data.federatedIdentities
        }
        else if (path.endsWith('/role-mappings/realm')) state.mappings.push(...data)
        else throw new Error(path)
    }
    const iamPut = async (path, data) => {
        if (!path.endsWith('/executions')) throw new Error(path)
        state.executions[0].requirement = data.requirement
    }
    const harness = {
        iamGet,
        iamPost,
        iamPut,
        sourceUser,
        state,
    }
    return harness
}
