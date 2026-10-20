const express = require('express')
const { randomBytes, randomUUID, scrypt } = require('node:crypto')
const { promisify } = require('node:util')
const fs = require('node:fs')
const path = require('node:path')

const hashPassword = promisify(scrypt)

function createApp({ dataFile = path.join(__dirname, 'data', 'users.json') } = {}) {
  const app = express()
  app.use(express.json({ limit: '16kb' }))

  app.post('/api/register', async (req, res, next) => {
    try {
      const { username, email, password } = req.body || {}
      if (typeof username !== 'string' || username.trim().length < 2 || username.trim().length > 50 ||
          typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
          typeof password !== 'string' || password.length < 8 || password.length > 128) {
        return res.status(400).json({ message: 'Enter a username (2–50 characters), a valid email, and a password (8–128 characters).' })
      }

      const normalizedEmail = email.trim().toLowerCase()
      const salt = randomBytes(16).toString('hex')
      const passwordHash = (await hashPassword(password, salt, 64)).toString('hex')
      // Read and write synchronously after hashing so concurrent requests cannot overwrite each other.
      const users = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, 'utf8')) : []
      if (users.some(user => user.email === normalizedEmail)) {
        return res.status(409).json({ message: 'An account with this email already exists.' })
      }
      const user = { id: randomUUID(), username: username.trim(), email: normalizedEmail }
      users.push({ ...user, salt, passwordHash })
      fs.mkdirSync(path.dirname(dataFile), { recursive: true })
      fs.writeFileSync(`${dataFile}.tmp`, JSON.stringify(users, null, 2), { mode: 0o600 })
      fs.renameSync(`${dataFile}.tmp`, dataFile)
      return res.status(201).json({ message: 'Registration successful. Your account has been created.', user })
    } catch (error) {
      next(error)
    }
  })

  app.use((error, req, res, next) => { // eslint-disable-line no-unused-vars
    const status = error.status === 400 || error.status === 413 ? error.status : 500
    res.status(status).json({ message: status === 500 ? 'Unable to register right now. Please try again.' : 'Invalid request body.' })
  })
  return app
}

if (require.main === module) {
  const port = process.env.PORT || 3000
  createApp().listen(port, '127.0.0.1', () => {
    console.log(`Registration API listening on http://127.0.0.1:${port}`)
  })
}

module.exports = { createApp }
