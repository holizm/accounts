import assert from 'assert/strict'
import {
    mock,
    test,
} from 'node:test'

const create = mock.fn(async () => {})
const getUserByUsername = mock.fn()
mock.module('core', { exports: { create } })
mock.module('./getByUsername.js', { exports: { getUserByUsername } })
const { getUserByPhone } = await import('./getByPhone.js')

test('new OTP users pass the same number for username and contact phone', async () => {
    const phone = '+15550001111'
    const user = { username: phone }
    getUserByUsername.mock.mockImplementationOnce(async () => undefined)
    getUserByUsername.mock.mockImplementationOnce(async () => user, 1)
    assert.equal(await getUserByPhone(phone), user)
    const params = create.mock.calls.at(-1).arguments[0]
    assert.equal(params.username, phone)
    assert.equal(params.phone, phone)
    assert.equal(params.part, 'accounts')
    assert.equal(params.type, 'user')
})

test('existing OTP users do not create another user or phone', async () => {
    create.mock.resetCalls()
    const user = { username: '+15550001111' }
    getUserByUsername.mock.mockImplementation(async () => user)
    assert.equal(await getUserByPhone(user.username), user)
    assert.equal(create.mock.callCount(), 0)
})
