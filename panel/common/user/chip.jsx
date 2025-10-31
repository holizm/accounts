const UserChip = ({ entity }) => {
    return <div className="flex gap-4 items-start">
        <img
            src={entity.relatedItems.personImageUrl || entity.relatedItems.imageUrl}
            className="w-10 h-10 rounded-full object-cover"
        />
        <span className="flex gap-2 items-center">
            <span className="font-bold text-slate-800">{entity.naturalPersonName || entity.juridicalPersonName || entity.userName}</span>
        </span>
    </div>
}

export default UserChip
