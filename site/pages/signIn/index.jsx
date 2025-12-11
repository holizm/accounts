import {
    $,
    component$,
    useComputed$,
    useSignal,
    useStyles,
} from "builder.io/qwik"
import { post } from "base"
import { useSeo } from "seo"
import {
    loadSignIn,
    SignInLayout,
} from "accounts"
import { loadSignIn as runnableLoader } from "loaders"
import { Layout as RunnableLayout } from "signInParts"

export default component$(() => {
    const data = loadSignIn().value
    const extraData = runnableLoader().value
    const phonePattern = /^\+?[0-9]{1,3}\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/
    const otpLength = useSignal(1)
    const otpPattern = new RegExp(`^\d{${otpLength.value}}$`)
    const phoneToBeChanged = useSignal("")
    const phone = useSignal("")
    const visiblePhone = useSignal(true)
    const phoneDirty = useSignal(false)
    const emptyPhone = useComputed$(() => {
        if (phoneDirty.value === true && phone.value?.trim() === "") {
            return true
        }
        return false
    })
    const invalidPhone = useComputed$(() => {
        if (phoneDirty.value === true && emptyPhone.value !== true && !phonePattern.test(phone.value)) {
            return true
        }
        return false
    })
    const otpTimer = useSignal(0)
    const timer = useComputed$(() => {
        const minutes = Math.floor(otpTimer.value / 60)
        const seconds = otpTimer.value % 60
        const formattedMinutes = String(minutes).padStart(2, "0")
        const formattedSeconds = String(seconds).padStart(2, "0")
        if (minutes === 0 && seconds === 0) {
            return null
        }
        return formattedMinutes + ":" + formattedSeconds
    })
    const sendingOtp = useSignal(false)
    const visibleOtp = useSignal(false)
    const otp = useSignal("")
    const otpDirty = useSignal(false)
    const emptyOtp = useComputed$(() => {
        if (otpDirty.value === true && otp.value?.trim() === "") {
            return true
        }
        return false
    })
    const invalidOtp = useComputed$(() => {
        if (otpDirty.value === true && emptyOtp.value !== true && !otpPattern.test(otp.value)) {
            return true
        }
        return false
    })
    const signingIn = useSignal(false)
    const sendOtp = $(e => {
        if (phoneDirty.value !== true) {
            phoneDirty.value = true
            return
        }
        if (emptyPhone.value === true) {
            return
        }
        if (invalidPhone.value === true) {
            return
        }
        if (otpTimer.value > 0 && phoneToBeChanged.value === phone.value) {
            visibleOtp.value = true
            visiblePhone.value = false
            return
        }
        if (signingIn.value == true) {
            return
        }
        sendingOtp.value = true
        post(`/accounts/sendOtp?phone=${phone.value}`)
            .then(data => {
                sendingOtp.value = false
                otpTimer.value = data.otpLifetimeInSeconds
                otpLength.value = data.otpLength
                if (globalThis.otpTimerInterval) {
                    clearInterval(globalThis.otpTimerInterval)
                }
                globalThis.otpTimerInterval = setInterval(() => {
                    if (otpTimer.value > 0) {
                        otpTimer.value = otpTimer.value - 1
                    }
                    else {
                        clearInterval(globalThis.otpTimerInterval)
                    }
                }, 1000)
                visibleOtp.value = true
                visiblePhone.value = false
            }, error => {
                alert(error)
                sendingOtp.value = false
            })
    })
    const changePhone = $(e => {
        phoneToBeChanged.value = phone.value
        visibleOtp.value = false
        visiblePhone.value = true
    })
    const signIn = $(e => {
        if (otpDirty.value !== true) {
            otpDirty.value = true
            return
        }
        if (emptyOtp.value === true) {
            return
        }
        if (invalidOtp.value === true) {
            return
        }
        signingIn.value = true
        post(`/accounts/signIn?phone=${phone.value}&otp=${otp.value}`)
            .then(data => {
                signingIn.value = false
                console.log(data)
            }, error => {
                alert(error)
                signingIn.value = false
            })
    })
    const phoneProps = {
        autofocus: true,
        dir: "ltr",
        disabled: sendingOtp.value,
        id: "accountsPhone",
        onClick$: $(e => visiblePhone.value != visiblePhone.value),
        onInput$: $(e => {
            phone.value = e.target.value
            phoneDirty.value = true
        }),
        value: phone.value,
    }
    const otpProps = {
        dir: "ltr",
        disabled: signingIn.value,
        id: "accountsOtp",
        onClick$: $(e => visibleOtp.value != visibleOtp.value),
        onInput$: $(e => otp.value = e.target.value),
        value: otp.value,
    }
    const sendOtpProps = {
        onClick$: sendOtp,
        hasClickHandler: true,
        disabled: sendingOtp.value
    }
    const changePhoneProps = {
        onClick$: changePhone,
        hasClickHandler: true
    }
    const signInProps = {
        onClick$: signIn,
        hasClickHandler: true,
        disabled: signingIn.value
    }

    const props = {
        ...data,
        changePhoneProps,
        emptyOtp: emptyOtp.value,
        emptyPhone: emptyPhone.value,
        invalidOtp: invalidOtp.value,
        invalidPhone: invalidPhone.value,
        otp,
        otpLength: otpLength.value,
        otpProps,
        phone,
        phoneProps,
        sendingOtp: sendingOtp.value,
        sendOtpProps,
        signingIn: signingIn.value,
        signInProps,
        timer: timer.value,
        visibleOtp: visibleOtp.value,
        visiblePhone: visiblePhone.value,
    }

    return RunnableLayout
        ?
        <RunnableLayout {...props} />
        :
        <SignInLayout {...props} />
})


export { loadSignIn }

export { runnableLoader }

const head = ({ resolveValue }) => {
    return useSeo(loadSignIn, resolveValue)
}

export { head }
