import { createHash } from 'crypto'
export default visibleTo => createHash('sha256').update(JSON.stringify(visibleTo ?? null)).digest('hex')
