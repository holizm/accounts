const UserChips = ({
    entity,
    usersPropertyName
}) => {
    const relatedItems = entity.relatedItems || entity

    return <div className="flex gap-2">
        {
            relatedItems[usersPropertyName || "users"]?.map(user => <span
                className="px-2 py-0.5 rounded-sm"
                key={user.id}
            >
                <img
                    className="w-8 h-8 rounded-full object-cover"
                    src={user.relatedItems.personImageUrl || user.relatedItems.imageUrl}
                    title={user.naturalPersonName}
                />
            </span>
            )
        }
    </div>
}

export default UserChips
