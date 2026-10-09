import { Image } from 'panel'

export default ({ item }) => <div className='flex gap-4 items-start'>
        <Image
            alt={item.naturalPersonName || item.juridicalPersonName || item.username || ''}
            className='w-10 h-10 rounded-full object-cover'
            source={item.personImageUrl || item.imageUrl}
        />
        <span className='flex gap-2 items-center'>
            <span className='font-bold text-slate-800'>{item.naturalPersonName || item.juridicalPersonName || item.username}</span>
        </span>
    </div>
