import {
    DateTime,
    Image,
    ValueWithTitle,
} from 'list'

export default item => <>
    <Image />
    <td>
        <ValueWithTitle
            value={(item.naturalPersonName || item.juridicalPersonName) || item.username}
            title={item.id}
        />
    </td>
    <DateTime
        date={item.lastSyncUtcDate}
    />
</>
