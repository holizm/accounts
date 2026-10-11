import { TitleSubtitle } from 'list'

export default ({ user }) =>
    <TitleSubtitle
        subtitle={user?.username}
        title={user?.naturalPersonName || user?.juridicalPersonName || 'anonymous'}
    />
