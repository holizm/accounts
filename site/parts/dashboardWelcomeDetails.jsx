import { UserDetail } from 'accounts'

export default ({
    session,
    translations,
}) => <dl class='details'>
    <UserDetail
        label={translations?.coreName}
        value={session?.value?.user?.name}
    />
    <UserDetail
        label={translations?.coreEmail}
        value={session?.value?.user?.email}
    />
</dl>
