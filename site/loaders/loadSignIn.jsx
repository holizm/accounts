import { routeLoader$ } from "builder.io/qwikCity"
import { useAsync } from "base"
import { getPage } from "contents"
import {
    getGlobalization,
    applyGranularityInBatch,
} from "globalization"

const loadSignIn = routeLoader$(async props => {
    const [
        globalization,
        page,
    ] = await useAsync([
        getGlobalization(props),
        getPage("signIn", props),
    ])

    applyGranularityInBatch(globalization.translations, [
        "ChangePhone",
        "EmptyOtp",
        "EmptyPhone",
        "InvalidOtp",
        "InvalidPhone",
        "Otp",
        "OtpLabel",
        "OtpSent",
        "Phone",
        "PhoneLabel",
        "RegisterOrSignIn",
        "Resend",
        "SendingOtp",
        "SendOtp",
        "SignIn",
        "SigningIn",
    ], "Accounts")

    return {
        ...globalization,
        ...page
    }
})

export default loadSignIn
