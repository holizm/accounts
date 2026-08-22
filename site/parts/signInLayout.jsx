import {
    Action,
    Field,
} from 'accounts'

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

    return <section class='signInLayout'>
        <h1 class='title'>{translations.registerOrSignIn}</h1>
        {
            visibleOtp &&
            <div
                class='otpNotice'
                role='status'
            >
                <span class='message'>
                    {translations.otpSent}
                </span>
                <b class='phone'>{phone}</b>
                <Action
                    {...changePhoneProps}
                    text={translations.changePhone}
                />
            </div>
        }
        <div class='form'>
            {
                visiblePhone &&
                <Field
                    error={
                        emptyPhone
                            ?
                            translations.emptyPhone
                            :
                            invalidPhone
                                ?
                                translations.invalidPhone
                                :
                                undefined
                    }
                    inputProps={phoneProps}
                    label={translations.phoneLabel}
                    placeholder={translations.phone}
                />
            }
            {
                visibleOtp &&
                <Field
                    error={
                        emptyOtp
                            ?
                            translations.emptyOtp
                            :
                            invalidOtp
                                ?
                                translations.invalidOtp
                                :
                                undefined
                    }
                    inputProps={otpProps}
                    label={translations.otpLabel}
                    placeholder={translations.otp}
                />
            }
            {
                visiblePhone &&
                <Action
                    {...sendOtpProps}
                    progress={sendingOtp}
                    text={
                        sendingOtp
                            ?
                            translations.sendingOtp
                            :
                            translations.sendOtp
                    }
                />
            }
            {
                visibleOtp &&
                <div class='actions'>
                    <Action
                        {...signInProps}
                        progress={signingIn}
                        text={
                            signingIn
                                ?
                                translations.signingIn
                                :
                                translations.signIn
                        }
                    />
                    <div class='resend'>
                        {
                            timer
                                ?
                                <div>{timer}</div>
                                :
                                sendingOtp
                                    ?
                                    <span
                                        class='progress'
                                        role='status'
                                    >
                                        {translations.sendingOtp}
                                    </span>
                                    :
                                    <a
                                        {...sendOtpProps}
                                        class='action'
                                    >
                                        {translations.resend}
                                    </a>
                        }
                    </div>
                </div>
            }
        </div>
    </section>
}
