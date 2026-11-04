import test from 'node:test'
import verify from '../../../../panel/test/verifyRecordViewTests.js'

const record = {
    username: 'Guest name',
    lastSyncDate: '2026-11-04T10:00:00Z'
}

test('card presents the saved record fields', async () => {
    await verify(new URL('./card.jsx', import.meta.url), ['Guest name','2026-11-04T10:00:00Z'], record)
})
