import {
    component$,
    Slot,
} from '@builder.io/qwik'
import { SignOut } from 'accounts'

export default component$(({ signOutText }) => <main class='dashboardLayout'>
    <aside class='sidebar'>
        <SignOut>
            <button
                class='signOutAction'
                type='button'
            >
                {signOutText}
            </button>
        </SignOut>
    </aside>
    <section class='content'>
        <Slot />
    </section>
</main>)
