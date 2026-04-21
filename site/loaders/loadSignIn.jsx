import { routeLoader$ } from '@builder.io/qwik-city'
import { useAsync } from 'core'
import { getValues } from 'contents'
import {
    getGlobalization,
    applyGranularityInBatch,
} from 'globalization'

export default routeLoader$(async props => {
    const [
        globalization,
        page,
    ] = await useAsync([
        getGlobalization(props),
        getValues('signIn', props),
    ])

    applyGranularityInBatch(globalization.translations, [
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
