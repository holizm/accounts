import { routeLoader$ } from "@builder.io/qwik-city"
import {
    getFromCacheOrApi,
    useAsync
} from "Base"
import { getLayout } from "Contents"
import {
    getGlobalization,
    applyGranularity,
} from "Globalization"

const loadDashboard = routeLoader$(async props => {

    const newUrl = "/dashboard"

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
        getLayout("dashboard", props),
        getGlobalization(props),
    ])
    globalization.translations.dashboardWelcomeMessage = applyGranularity(globalization.translations, "DashboardWelcomeMessage", "Accounts")

    return {
        ...data,
        ...layout,
        ...globalization,
    }
})

export default loadDashboard
