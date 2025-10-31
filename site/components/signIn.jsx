import {
    $,
    component$,
    Slot,
    useSignal,
} from "@builder.io/qwik"
import { Form } from "@builder.io/qwik-city"
import { useSignIn } from "Accounts"

const SignIn = component$(({
    content,
    progress: ProgressComponent,
    returnTo,
}) => {

    const signIn = useSignIn()
    const progress = useSignal(false)

    const handleClick = $(() => {
        progress.value = true
        signIn.submit({
            providerId: "keycloak",
            options: {
                callbackUrl: returnTo || "/"
            }
        })
    })

    return progress.value
        ?
        ProgressComponent
            ?
            <ProgressComponent />
            :
            <span>...</span>
        :
        <div action={signIn}>
            <input
                type="hidden"
                name="providerId"
                value="keycloak"
            />
            <input
                type="hidden"
                name="options.callbackUrl"
                value={returnTo || "/"}
            />
            <div onClick$={handleClick}>
                <Slot />
            </div>
        </div>
})

export default SignIn
