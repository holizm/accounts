import {
    configure,
    getRecordVisibility,
    setRecordVisibility,
} from 'accountsBusiness'
export default {
    configureOnPost: configure,
    recordVisibility: getRecordVisibility,
    setRecordVisibilityOnPost: setRecordVisibility
}
