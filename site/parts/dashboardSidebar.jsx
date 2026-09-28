import { SignOut } from 'accounts'

export default ({
    menu,
    pathname,
    translations,
}) => <aside class='sidebar'>
    <nav class='menu'>
        {
            menu?.map(item => <a
                aria-current={pathname === `/accounts/dashboard${item.path}` && 'page'}
                class='item'
                href={`/accounts/dashboard${item.path}`}
                key={item.path}
            >
                {
                    translations?.[item.title]
                }
            </a>)
        }
    </nav>
    <SignOut>
        <button
            class='signOutAction'
            type='button'
        >
            {
                translations?.accountsSignOut
            }
        </button>
    </SignOut>
</aside>
