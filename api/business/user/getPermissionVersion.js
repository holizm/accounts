import { createHash } from 'crypto'

export const getPermissionVersion = assignments => {
    const values = assignments.map(assignment => [assignment.permission, assignment.effect || 'allow']).sort()
    const version = createHash('sha256').update(JSON.stringify(values)).digest('hex')
    return version
}
