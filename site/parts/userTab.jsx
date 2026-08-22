import { component$ } from '@builder.io/qwik'
import {
    UserDetail,
    useSession,
} from 'accounts'

export default component$(() => {

    const session = useSession()

    return <dl class='userDetails'>
        <UserDetail
            label='Email'
            value={session?.value?.user?.email}
        />
        <UserDetail
            label='Name'
            value={session?.value?.user?.name}
        />
    </dl>
})
