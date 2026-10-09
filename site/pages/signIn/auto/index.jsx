import { component$, useVisibleTask$ } from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'
import accountsUseSignIn from 'accountsUseSignIn'

export default component$(() => {
    const loc = useLocation()
    const signIn = accountsUseSignIn()

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
