import { component$ } from '@builder.io/qwik'
import AccountsUserDetail from 'accountsUserDetail'
import accountsUseSession from 'accountsUseSession'

export default component$(() => {

    const session = accountsUseSession()

    return <dl class='details'>
        <AccountsUserDetail
            label='Email'
            value={session?.value?.user?.email}
        />
        <AccountsUserDetail
            label='Name'
            value={session?.value?.user?.name}
        />
    </dl>
})
