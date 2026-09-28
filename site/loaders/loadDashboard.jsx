import { routeLoader$ } from '@builder.io/qwik-city'
import {
    getFromCacheOrApi,
    useAsync
} from 'core'
import { getValues } from 'contents'
import { getPersonInfo } from 'contacts'
import {
    getGlobalization,
    applyGranularity,
} from 'globalization'

export default routeLoader$(async props => {

    const newUrl = '/accounts/dashboard'

    const {
        fail,
        params,
        response,
        url,
    } = props

    const [
        data,
        layout,
        globalization,
    ] = await useAsync([
        getFromCacheOrApi(newUrl, props),
        getValues('dashboard', props),
        getGlobalization(props),
        getPersonInfo(props)
    ])
    globalization.translations.dashboardWelcomeMessage = applyGranularity(globalization.translations, 'dashboardWelcomeMessage', 'accounts')

    const dashboard = {
        ...data,
        ...layout,
        ...globalization,
        profileUrl: `${globalization?.localePathPrefix || ''}/accounts/dashboard/profile`,
    }
    return dashboard
})
