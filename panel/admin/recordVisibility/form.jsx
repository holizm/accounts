import { PageForm } from 'form'
import Inputs from './inputs'

export default <PageForm
    disableAutomaticItemLoading
    hasBack
    inputs={<Inputs />}
    noMeaning
    returnTo='/accounts/user/list'
    submitTo='/accounts/setRecordVisibility'
    title='visibleTo'
/>
