import { TitleSubtitle } from "List"

const UserNameTd = ({ user }) =>
    <TitleSubtitle
        title={user?.naturalPersonName || user?.juridicalPersonName || "AccountsAnonymous"}
        subtitle={user?.userName}
    />

export default UserNameTd
