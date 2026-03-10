export default ({
    item,
    usersPropertyName
}) => {
    return <div className='flex gap-2'>
        {
            item[usersPropertyName || 'users']?.map(user => <span
                className='px-2 py-0.5 rounded-sm'
                key={user.id}
            >
                <img
                    className='w-8 h-8 rounded-full object-cover'
                    src={user.personImageUrl || user.imageUrl}
                    title={user.naturalPersonName}
                />
            </span>
            )
        }
    </div>
}
