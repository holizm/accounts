import { routeLoader$ } from '@builder.io/qwik-city'
import useAsync from 'useAsync'
import contentsGetValues from 'contentsGetValues'
import contactsGetPersonInfo from 'contactsGetPersonInfo'
import globalizationGetGlobalization from 'globalizationGetGlobalization'
import globalizationResolveTranslation from 'globalizationResolveTranslation'

export default routeLoader$(async props => {

    const [
        layout,
        globalization,
        personInfo
    ] = await useAsync([
        contentsGetValues('dashboard', props),
        globalizationGetGlobalization(props),
        contactsGetPersonInfo(props)
    ])
    globalization.translations.dashboardWelcomeMessage = globalizationResolveTranslation(globalization.translations, 'dashboardWelcomeMessage', 'accounts')

    const dashboard = {
        ...layout,
        ...globalization,
        profileUrl: `${globalization?.localePathPrefix || ''}/dashboard/profile`,
        personInfo,
    }
    return dashboard
})
