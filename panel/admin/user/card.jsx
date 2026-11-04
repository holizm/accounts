import {
    Card,
    DateTime,
    Field,
    Image,
} from 'list'

export default item => <Card>
    <Image />
    <Field
        headline
        label='userName'
        value={item.naturalPersonName || item.juridicalPersonName || item.username}
    />
    <Field
        component={DateTime}
        date={item.lastSyncDate}
        label='lastSyncDate'
    />
</Card>
