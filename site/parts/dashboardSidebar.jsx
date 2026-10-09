import AccountsSignOut from 'accountsSignOut'

export default ({
    menu,
    pathname,
    translations,
}) => <aside class='sidebar'>
    <nav class='menu'>
        {
            menu?.map(item => <a
                aria-current={pathname === `/dashboard${item.path}` && 'page'}
                class='item'
                href={`/dashboard${item.path}`}
                key={item.path}
            >
                {
                    translations?.[item.title]
                }
            </a>)
        }
    </nav>
    <AccountsSignOut>
        <button
            class='signOutAction'
            type='button'
        >
            {
                translations?.accountsSignOut
            }
        </button>
    </AccountsSignOut>
</aside>
