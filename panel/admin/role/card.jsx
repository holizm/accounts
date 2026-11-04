import {
    Card,
    Field,
} from 'list'

export default item => <Card>
    <Field
        headline
        label='role'
        value={item.name}
    />
</Card>
