import { defaultDisplay } from 'app'
export default item => defaultDisplay({
    ...item,
    title: item?.title || item?.name || item?.username || item?.naturalPersonName || item?.juridicalPersonName || (item?.number === undefined ? undefined : String(item.number))
})
