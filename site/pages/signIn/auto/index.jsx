import { component$, useVisibleTask$ } from "builder.io/qwik"
import { useLocation } from "builder.io/qwik-city"
import { useSignIn } from "accounts"

export default component$(() => {
    const loc = useLocation()
    const signIn = useSignIn()

    useVisibleTask$(() => {
        const redirectTo = loc.url.searchParams.get("redirectTo") || "/"
        signIn.submit({
            providerId: "keycloak",
            options: { redirectTo }
        })
    })

    return <div class="flex items-center justify-center h-full w-full">
        <div class="h-5 w-5 animate-spin rounded-full border border-current border-t-transparent" />
    </div>
})
