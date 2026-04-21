import { TitleSubtitle } from 'list'

export default ({ user }) =>
    <TitleSubtitle
        title={user?.naturalPersonName || user?.juridicalPersonName || 'accountsAnonymous'}
        subtitle={user?.userName}
    />
