import { Image } from 'panel'

export default ({
    item,
    usersPropertyName
}) => <div className='flex gap-2'>
        {
            item[usersPropertyName || 'users']?.map(user => <span
                className='px-2 py-0.5 rounded-sm'
                key={user.id}
            >
                <Image
                    alt={user.naturalPersonName || user.juridicalPersonName || user.username || ''}
                    className='w-8 h-8 rounded-full object-cover'
                    source={user.personImageUrl || user.imageUrl}
                    title={user.naturalPersonName}
                />
            </span>
            )
        }
    </div>
