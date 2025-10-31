import {
    $,
    component$,
    Slot,
    useSignal,
} from "@builder.io/qwik"
import { useSignOut } from "Accounts"

const SignOut = component$(({
    progress: ProgressComponent,
    returnTo,
}) => {

    const signOut = useSignOut()
    const progress = useSignal(false)
    const handleClick = $(() => {
        progress.value = true
        signOut.submit({ redirectTo: returnTo || "/" })
    })

    return progress.value
        ?
        ProgressComponent
            ?
            <ProgressComponent />
            :
            <span>...</span>
        :
        <div>
            <input
                type="hidden"
                name="callbackUrl"
                value={returnTo || "/"}
            />
            <div onClick$={handleClick}>
                <Slot />
            </div>
        </div>
})

export default SignOut
