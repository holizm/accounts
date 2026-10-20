import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'

const contact = { id: 'contactId' }
const person = {
    id: 'personId',
    inherited: contact,
}
const create = mock.fn(async () => person)
mock.module('core', { exports: { create } })
mock.module('./ensureIamUser.js', { defaultExport: async () => {} })
const { default: preCreation } = await import('./preCreation.js')

test('OTP user creation stores its login number on the new contact', async () => {
    create.mock.resetCalls()
    const item = { username: '+15550001111' }
    await preCreation({
        item,
        phone: item.username,
    })
    assert.deepEqual(item.contact, contact)
    assert.equal(item.person.id, person.id)
    assert.deepEqual(create.mock.calls[1].arguments[0], {
        contact: contact.id,
        default: true,
        number: item.username,
        part: 'contacts',
        type: 'phone',
    })
})

test('ordinary usernames do not become phone records', async () => {
    create.mock.resetCalls()
    await preCreation({ item: { username: 'operator' } })
    assert.equal(create.mock.callCount(), 1)
})

test('an existing person is preserved without duplicate contact creation', async () => {
    create.mock.resetCalls()
    await preCreation({
        item: { person: { id: 'existingPerson' } },
        phone: '+15550001111',
    })
    assert.equal(create.mock.callCount(), 0)
})
