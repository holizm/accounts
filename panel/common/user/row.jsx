import {
    DateTime,
    Image,
    ValueWithTitle,
} from 'list'

export default item => <>
    <Image />
    <td>
        <ValueWithTitle
            title={item.id}
            value={(item.naturalPersonName || item.juridicalPersonName) || item.username}
        />
    </td>
    <DateTime date={item.lastSyncDate} />
</>
