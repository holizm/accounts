import {
    dbItem,
    translateInternally,
} from 'core'
import getVisibilityTarget from '../user/getVisibilityTarget.js'
export default async ({ items }) => {
    for (const item of items) {
        const user = await dbItem({
            acrossLocales: true,
            id: item.user,
            part: 'accounts',
            type: 'user'
        })
        item.userName = user?.username || (await translateInternally('notFound'))
        item.title = item.tenantWide === true ? await translateInternally('allRecords') : (await getVisibilityTarget(item.item)).title
    }
}
