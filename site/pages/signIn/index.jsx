import {
    $,
    component$,
    useComputed$,
    useSignal,
} from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'
import post from 'post'
import seoUseSeo from 'seoUseSeo'
import accountsLoadSignIn from 'accountsLoadSignIn'
import accountsUseSignIn from 'accountsUseSignIn'
import AccountsSignInLayout from 'accountsSignInLayout'
import runnableLoader from 'loadSignIn'
import SignInPartsLayout from 'signInPartsLayout'

export default component$(() => {
    const data = accountsLoadSignIn().value
    runnableLoader()
    const authSignIn = accountsUseSignIn()
    const location = useLocation()
    const phonePattern = /^\+?[0-9]{10,15}$/
    const otpLength = useSignal(1)
    const otpPattern = new RegExp(`^\\d{${otpLength.value}}$`)
    const phoneToBeChanged = useSignal('')
    const phone = useSignal('')
    const visiblePhone = useSignal(true)
    const phoneDirty = useSignal(false)
    const emptyPhone = useComputed$(() => {
        if (phoneDirty.value === true && phone.value?.trim() === '') {
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
        const formattedMinutes = String(minutes).padStart(2, '0')
        const formattedSeconds = String(seconds).padStart(2, '0')
        if (minutes === 0 && seconds === 0) {
            return null
        }
        return formattedMinutes + ':' + formattedSeconds
    })
    const sendingOtp = useSignal(false)
    const visibleOtp = useSignal(false)
    const otp = useSignal('')
    const otpDirty = useSignal(false)
    const emptyOtp = useComputed$(() => {
        if (otpDirty.value === true && otp.value?.trim() === '') {
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
    const sendOtp = $(async () => {
        phoneDirty.value = true
        if (!phone.value?.trim() || !phonePattern.test(phone.value)) return
        if (otpTimer.value > 0 && phoneToBeChanged.value === phone.value) {
            visibleOtp.value = true
            visiblePhone.value = false
            return
        }
        if (signingIn.value || sendingOtp.value) return
        sendingOtp.value = true
        post('/accounts/sendOtp', { phone: phone.value })
            .then(data => {
                sendingOtp.value = false
                phoneToBeChanged.value = phone.value
                otpTimer.value = data.resendDelayInSeconds
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
    const changePhone = $(() => {
        visibleOtp.value = false
        visiblePhone.value = true
    })
    const signIn = $(async () => {
        otpDirty.value = true
        if (!otp.value?.trim() || !otpPattern.test(otp.value)) return
        signingIn.value = true
        try {
            await authSignIn.submit({
                providerId: 'credentials',
                options: {
                    otp: otp.value,
                    phone: phone.value,
                    redirectTo: '/dashboard',
                },
            })
        } catch (e) {
            alert(e)
        } finally {
            signingIn.value = false
        }
    })
    const phoneProps = {
        autofocus: true,
        autoComplete: 'tel',
        dir: 'ltr',
        disabled: sendingOtp.value,
        id: 'corePhone',
        inputMode: 'tel',
        onInput$: $(e => {
            phone.value = e.target.value
            phoneDirty.value = true
        }),
        type: 'tel',
        value: phone.value,
    }
    const otpProps = {
        autoComplete: 'one-time-code',
        dir: 'ltr',
        disabled: signingIn.value,
        id: 'accountsOtp',
        inputMode: 'numeric',
        onInput$: $(e => otp.value = e.target.value),
        type: 'text',
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
        authError: location.url.searchParams.get('error') === 'CredentialsSignin',
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

    return SignInPartsLayout
        ?
        <SignInPartsLayout {...props} />
        :
        <AccountsSignInLayout {...props} />
})


export { accountsLoadSignIn as loadSignIn }

export { runnableLoader }

const head = ({ resolveValue }) => {
    return seoUseSeo(accountsLoadSignIn, resolveValue)
}

export { head }
