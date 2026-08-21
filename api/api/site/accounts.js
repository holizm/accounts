import { sendOtp } from '../../business/accounts/sendOtp.js'
import { signIn } from '../../business/accounts/signIn.js'

export default {
    sendOtpOnPost: sendOtp,
    signInOnPost: signIn,
}
