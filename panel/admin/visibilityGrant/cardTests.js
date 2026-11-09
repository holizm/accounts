import test from 'node:test'
import verify from '../../../../panel/testing/verifyRecordView.js'

const record = {
    userName: 'Staff member',
    title: 'Selected hotel'
}

test('card presents the saved record fields', async () => {
    await verify(new URL('./card.jsx', import.meta.url), ['Staff member','Selected hotel'], record)
})
