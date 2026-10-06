import {
    Lookup,
    Text,
} from 'list'

export default <>
    <Text
        placeholder='userName'
        property='username'
    />
    <Lookup
        placeholder='coreRoles'
        property='role'
        type='accounts/role'
    />
</>
