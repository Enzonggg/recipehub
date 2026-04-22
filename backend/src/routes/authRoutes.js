import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { dbPool } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'
import { createAccessToken } from '../services/tokenService.js'

const router = Router()

function sanitizeUser(user) {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    role: user.role,
    isActive: Boolean(user.is_active),
    createdAt: user.created_at,
  }
}

async function getDbUserById(userId) {
  const [rows] = await dbPool.execute(
    'SELECT id, full_name, email, password_hash, role, is_active, created_at FROM users WHERE id = ? LIMIT 1',
    [userId],
  )

  return rows[0]
}

router.post('/login', async (req, res) => {
  const { role, identifier, password } = req.body || {}

  if (!role || !identifier || !password) {
    return res.status(400).json({ message: 'role, identifier, and password are required.' })
  }

  if (!['admin', 'customer', 'staff'].includes(role)) {
    return res.status(400).json({ message: 'role must be admin, customer, or staff.' })
  }

  try {
    const [rows] = await dbPool.execute(
      'SELECT id, full_name, email, password_hash, role, is_active, created_at FROM users WHERE email = ? AND role = ? LIMIT 1',
      [identifier, role],
    )

    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }

    const user = rows[0]

    if (!user.is_active) {
      return res.status(403).json({ message: 'Account is inactive.' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }

    const token = createAccessToken({
      sub: user.id,
      role: user.role,
      email: user.email,
    })

    return res.json({
      message: 'Login successful.',
      token,
      user: sanitizeUser(user),
    })
  } catch (error) {
    return res.status(500).json({ message: 'Login failed.', error: error.message })
  }
})

router.post('/register/customer', async (req, res) => {
  const { fullName, email, password } = req.body || {}

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'fullName, email, and password are required.' })
  }

  try {
    const [existing] = await dbPool.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email])

    if (existing.length) {
      return res.status(409).json({ message: 'Email is already registered.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const [result] = await dbPool.execute(
      'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [fullName, email, passwordHash, 'customer'],
    )

    const token = createAccessToken({
      sub: result.insertId,
      role: 'customer',
      email,
    })

    return res.status(201).json({
      message: 'Customer registered successfully.',
      token,
      user: {
        id: result.insertId,
        fullName,
        email,
        role: 'customer',
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed.', error: error.message })
  }
})

router.post('/register/staff', async (req, res) => {
  const { fullName, email, password } = req.body || {}

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'fullName, email, and password are required.' })
  }

  try {
    const [existing] = await dbPool.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email])

    if (existing.length) {
      return res.status(409).json({ message: 'Email is already registered.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const [result] = await dbPool.execute(
      'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [fullName, email, passwordHash, 'staff'],
    )

    const token = createAccessToken({
      sub: result.insertId,
      role: 'staff',
      email,
    })

    return res.status(201).json({
      message: 'Staff registered successfully.',
      token,
      user: {
        id: result.insertId,
        fullName,
        email,
        role: 'staff',
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Staff registration failed.', error: error.message })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await getDbUserById(req.user.sub)

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    return res.json({ user: sanitizeUser(user) })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch profile.', error: error.message })
  }
})

router.patch('/me', requireAuth, async (req, res) => {
  if (req.user.role === 'admin') {
    return res.status(400).json({ message: 'Admin profile is fixed and cannot be edited.' })
  }

  const { fullName, email } = req.body || {}

  if (!fullName || !email) {
    return res.status(400).json({ message: 'fullName and email are required.' })
  }

  try {
    const existing = await getDbUserById(req.user.sub)

    if (!existing) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const [emailRows] = await dbPool.execute('SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1', [email, req.user.sub])

    if (emailRows.length) {
      return res.status(409).json({ message: 'Email is already in use.' })
    }

    await dbPool.execute('UPDATE users SET full_name = ?, email = ? WHERE id = ?', [fullName, email, req.user.sub])

    const updatedUser = await getDbUserById(req.user.sub)

    return res.json({
      message: 'Profile updated successfully.',
      user: sanitizeUser(updatedUser),
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update profile.', error: error.message })
  }
})

router.patch('/password', requireAuth, async (req, res) => {
  if (req.user.role === 'admin') {
    return res.status(400).json({ message: 'Admin password is fixed and cannot be changed here.' })
  }

  const { currentPassword, newPassword } = req.body || {}

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'currentPassword and newPassword are required.' })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters.' })
  }

  try {
    const user = await getDbUserById(req.user.sub)

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' })
    }

    const nextHash = await bcrypt.hash(newPassword, 10)
    await dbPool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [nextHash, req.user.sub])

    return res.json({ message: 'Password updated successfully.' })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update password.', error: error.message })
  }
})

export { router as authRoutes }
