import test from 'node:test'
import verify from '../../../../panel/testing/verifyRecordView.js'

const record = {
    name: 'Reception'
}

test('card presents the saved record fields', async () => {
    await verify(new URL('./card.jsx', import.meta.url), ['Reception'], record)
})
