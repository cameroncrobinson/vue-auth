const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { scryptSync } = require('node:crypto')
const { createApp } = require('./index')

async function main() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-auth-test-'))
  const dataFile = path.join(directory, 'users.json')
  const server = createApp({ dataFile }).listen(0, '127.0.0.1')
  await new Promise(resolve => server.on('listening', resolve))
  const url = `http://127.0.0.1:${server.address().port}/api/register`
  const post = body => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  try {
    assert.equal((await post({})).status, 400)
    const input = { username: 'Test User', email: 'TEST@example.com', password: 'test-password-123' }
    const response = await post(input)
    assert.equal(response.status, 201)
    const result = await response.json()
    assert.equal(result.user.email, 'test@example.com')
    assert.equal(result.user.passwordHash, undefined)
    assert.equal(result.user.salt, undefined)
    const stored = JSON.parse(fs.readFileSync(dataFile, 'utf8'))[0]
    assert.equal(stored.password, undefined)
    assert.equal(stored.passwordHash, scryptSync(input.password, stored.salt, 64).toString('hex'))
    assert.equal((await post({ ...input, email: 'test@example.com' })).status, 409)
    const concurrent = await Promise.all([post({ ...input, email: 'other@example.com' }), post({ ...input, email: 'OTHER@example.com' })])
    assert.deepEqual(concurrent.map(response => response.status).sort(), [201, 409])
    const malformed = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })
    assert.equal(malformed.status, 400)
    assert.equal(JSON.parse(fs.readFileSync(dataFile, 'utf8')).length, 2)
    console.log('Passed: registration, validation, password hashing, duplicate emails, concurrent duplicates, malformed JSON, persisted records.')
  } finally {
    await new Promise(resolve => server.close(resolve))
    fs.rmSync(directory, { recursive: true, force: true })
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
