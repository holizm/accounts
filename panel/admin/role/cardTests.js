import test from 'node:test'
import verify from '../../../../panel/test/verifyRecordViewTests.js'

const record = {
    name: 'Reception'
}

test('card presents the saved record fields', async () => {
    await verify(new URL('./card.jsx', import.meta.url), ['Reception'], record)
})
