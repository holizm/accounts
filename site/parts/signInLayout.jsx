import { Cta } from 'accounts'

export default props => {

    const {
        changePhoneProps,
        emptyOtp,
        emptyPhone,
        invalidOtp,
        invalidPhone,
        otpProps,
        phone,
        phoneProps,
        sendingOtp,
        sendOtpProps,
        signingIn,
        signInProps,
        timer,
        translations,
        visibleOtp,
        visiblePhone,
    } = props

    const container = 'relative'
    const field = 'border px-4 py-2 font-medium text-base text-neutral-800 outline-none'
    const label = 'bg-neutral-200 text-neutral-900 px-5 py-2 '
    const error = 'text-red-600 animate-pulse text-md start-0 end-0 font-medium my-2 absolute'

    return <div class='text-center my-10'>
        <h2 class='mb-10 text-3xl font-semibold text-neutral-900'>{translations.registerOrSignIn}</h2>
        {
            visibleOtp &&
            <div class='mb-4 max-w-lg mx-auto'>
                <div class='flex flex-col md:flex-row items-center justify-between text-sm text-neutral-700'>
                    {translations.otpSent}
                    <span class='text-lg font-semibold text-neutral-900 my-1'>{phone}</span>
                    {/* <Cta
                        {...changePhoneProps}
                        text={translations.changePhone}
                        reverse
                    /> */}
                </div>
            </div>
        }
        <div class='mx-auto max-w-lg h-96 grid place-items-center border '>
            {
                visiblePhone &&
                <div class={container}>
                    <div class={label}>{translations.phoneLabel}</div>
                    <input
                        {...phoneProps}
                        class={field}
                        placeholder={translations.phone}
                    />
                    {
                        emptyPhone &&
                        <div class={error}>{translations.emptyPhone}</div>
                    }
                    {
                        invalidPhone &&
                        <div class={error}>{translations.invalidPhone}</div>
                    }
                </div>
            }
            {
                visibleOtp &&
                <div class={container}>
                    <div class={label}>{translations.otpLabel}</div>
                    <input
                        {...otpProps}
                        class={field}
                        placeholder={translations.otp}
                    />
                    {
                        emptyOtp &&
                        <div class={error}>{translations.emptyOtp}</div>
                    }
                    {
                        invalidOtp &&
                        <div class={error}>{translations.invalidOtp}</div>
                    }
                </div>
            }
            {
                visiblePhone &&
                <Cta
                    {...sendOtpProps}
                    large
                    reverse
                    progress={sendingOtp}
                    text={sendingOtp ? translations.sendingOtp : translations.sendOtp}
                />
            }
            {
                visibleOtp &&
                <div class={container}>
                    <Cta
                        {...signInProps}
                        large
                        reverse
                        progress={signingIn}
                        text={signingIn ? translations.signingIn : translations.signIn}
                    />
                    <div class='absolute start-0 end-0 mt-4 text-sm'>
                        {
                            timer
                                ?
                                <div>{timer}</div>
                                :
                                sendingOtp
                                    ?
                                    <div class='flex items-center gap-3 justify-center text-xs'>
                                        {translations.sendingOtp}
                                    </div>
                                    :
                                    <a
                                        {...sendOtpProps}
                                        class='cursor-pointer'
                                    >
                                        {translations.resend}
                                    </a>
                        }
                    </div>
                </div>
            }
        </div>
    </div>
}
