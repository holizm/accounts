import { TitleSubtitle } from 'list'

const UserNameTd = ({ user }) =>
    <TitleSubtitle
        title={user?.naturalPersonName || user?.juridicalPersonName || "AccountsAnonymous"}
        subtitle={user?.userName}
    />

export default UserNameTd
