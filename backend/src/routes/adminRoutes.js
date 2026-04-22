import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { dbPool } from '../config/db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

function sanitizeStaff(user) {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    role: user.role,
    isActive: Boolean(user.is_active),
    createdAt: user.created_at,
  }
}

router.get('/dashboard-stats', requireAuth, requireRole('admin'), async (_req, res) => {
  try {
    const [userCountRows] = await dbPool.execute(
      `SELECT role, COUNT(*) AS total
       FROM users
       WHERE role IN ('customer', 'staff')
       GROUP BY role`,
    )

    const [recipeCountRows] = await dbPool.execute(
      `SELECT status, COUNT(*) AS total
       FROM recipes
       GROUP BY status`,
    )

    const stats = {
      customers: 0,
      staff: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
    }

    for (const row of userCountRows) {
      stats[row.role] = Number(row.total || 0)
    }

    for (const row of recipeCountRows) {
      stats[row.status] = Number(row.total || 0)
    }

    return res.json({ stats })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load dashboard stats.', error: error.message })
  }
})

router.post('/staff', requireAuth, requireRole('admin'), async (req, res) => {
  const { fullName, email, password } = req.body || {}

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'fullName, email, and password are required.' })
  }

  try {
    const [existing] = await dbPool.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email])

    if (existing.length) {
      return res.status(409).json({ message: 'Email is already in use.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const [result] = await dbPool.execute(
      'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [fullName, email, passwordHash, 'staff'],
    )

    return res.status(201).json({
      message: 'Staff account created successfully.',
      staff: {
        id: result.insertId,
        fullName,
        email,
        role: 'staff',
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create staff account.', error: error.message })
  }
})

router.get('/staff', requireAuth, requireRole('admin'), async (_req, res) => {
  try {
    const [rows] = await dbPool.execute(
      `SELECT id, full_name, email, role, is_active, created_at
       FROM users
       WHERE role = 'staff'
       ORDER BY created_at DESC`,
    )

    return res.json({ staff: rows.map(sanitizeStaff) })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load staff accounts.', error: error.message })
  }
})

router.patch('/staff/:staffId', requireAuth, requireRole('admin'), async (req, res) => {
  const { staffId } = req.params
  const { fullName, email, isActive } = req.body || {}

  if (!fullName || !email || typeof isActive !== 'boolean') {
    return res.status(400).json({ message: 'fullName, email, and isActive are required.' })
  }

  try {
    const [existingRows] = await dbPool.execute(
      `SELECT id, full_name, email, role, is_active, created_at
       FROM users
       WHERE id = ? AND role = 'staff'
       LIMIT 1`,
      [staffId],
    )

    if (!existingRows.length) {
      return res.status(404).json({ message: 'Staff account not found.' })
    }

    const [emailRows] = await dbPool.execute('SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1', [email, staffId])

    if (emailRows.length) {
      return res.status(409).json({ message: 'Email is already in use.' })
    }

    await dbPool.execute('UPDATE users SET full_name = ?, email = ?, is_active = ? WHERE id = ? AND role = ?', [
      fullName,
      email,
      isActive ? 1 : 0,
      staffId,
      'staff',
    ])

    const [updatedRows] = await dbPool.execute(
      `SELECT id, full_name, email, role, is_active, created_at
       FROM users
       WHERE id = ? AND role = 'staff'
       LIMIT 1`,
      [staffId],
    )

    return res.json({
      message: 'Staff account updated successfully.',
      staff: sanitizeStaff(updatedRows[0]),
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update staff account.', error: error.message })
  }
})

router.delete('/staff/:staffId', requireAuth, requireRole('admin'), async (req, res) => {
  const { staffId } = req.params

  try {
    const [existingRows] = await dbPool.execute(
      `SELECT id, full_name, email
       FROM users
       WHERE id = ? AND role = 'staff'
       LIMIT 1`,
      [staffId],
    )

    if (!existingRows.length) {
      return res.status(404).json({ message: 'Staff account not found.' })
    }

    await dbPool.execute('UPDATE users SET is_active = 0 WHERE id = ? AND role = ?', [staffId, 'staff'])

    return res.json({ message: 'Staff account deactivated successfully.' })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to deactivate staff account.', error: error.message })
  }
})

export { router as adminRoutes }
