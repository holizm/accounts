import {
    Card,
    Field,
} from 'list'

export default item => <Card>
    <Field
        headline
        label='userName'
        value={item.userName}
    />
    <Field
        label='visibleTo'
        value={item.title}
    />
</Card>
