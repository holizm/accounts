const UserChip = ({ item }) => {
    return <div className="flex gap-4 items-start">
        <img
            src={item.personImageUrl || item.imageUrl}
            className="w-10 h-10 rounded-full object-cover"
        />
        <span className="flex gap-2 items-center">
            <span className="font-bold text-slate-800">{item.naturalPersonName || item.juridicalPersonName || item.userName}</span>
        </span>
    </div>
}

export default UserChip
