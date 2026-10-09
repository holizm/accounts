import { routeLoader$ } from '@builder.io/qwik-city'
import useAsync from 'useAsync'
import contentsGetValues from 'contentsGetValues'
import globalizationGetGlobalization from 'globalizationGetGlobalization'
import globalizationApplyGranularityInBatch from 'globalizationApplyGranularityInBatch'

export default routeLoader$(async props => {
    const [
        globalization,
        page,
    ] = await useAsync([
        globalizationGetGlobalization(props),
        contentsGetValues('signIn', props),
    ])

    globalizationApplyGranularityInBatch(globalization.translations, [
        'changePhone',
        'emptyOtp',
        'emptyPhone',
        'invalidOtp',
        'invalidPhone',
        'otp',
        'otpLabel',
        'otpSent',
        'phone',
        'phoneLabel',
        'registerOrSignIn',
        'resend',
        'sendingOtp',
        'sendOtp',
        'signIn',
        'signingIn',
    ], 'accounts')

    return {
        ...globalization,
        ...page
    }
})
