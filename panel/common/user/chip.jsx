import { Image } from 'panel'
import './chip.css'

export default ({ item }) => <div className='userChip'>
        <Image
            alt={item.naturalPersonName || item.juridicalPersonName || item.username || ''}
            className='avatar'
            source={item.personImageUrl || item.imageUrl}
        />
        <span className='identity'>
            <span className='name'>
                {
                    item.naturalPersonName || item.juridicalPersonName || item.username
                }
            </span>
        </span>
    </div>
