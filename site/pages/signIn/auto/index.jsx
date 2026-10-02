import { component$, useVisibleTask$ } from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'
import { useSignIn } from 'accounts'
import '../../../styles/autoSignIn.css'

export default component$(() => {
    const loc = useLocation()
    const signIn = useSignIn()

    useVisibleTask$(() => {
        const redirectTo = loc.url.searchParams.get('redirectTo') || '/dashboard'
        signIn.submit({
            providerId: 'keycloak',
            options: { redirectTo }
        })
    })

    return <div class='autoSignIn'>
        <div class='progress' />
    </div>
})
