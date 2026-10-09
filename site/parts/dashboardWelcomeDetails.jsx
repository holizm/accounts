import AccountsUserDetail from 'accountsUserDetail'

export default ({
    session,
    translations,
}) => <dl class='details'>
    <AccountsUserDetail
        label={translations?.coreName}
        value={session?.value?.user?.name}
    />
    <AccountsUserDetail
        label={translations?.coreEmail}
        value={session?.value?.user?.email}
    />
</dl>
