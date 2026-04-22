import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { dbPool } from './config/db.js'
import { adminRoutes } from './routes/adminRoutes.js'
import { authRoutes } from './routes/authRoutes.js'
import { recipeRoutes } from './routes/recipeRoutes.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 4000)

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.get('/api/health', async (_req, res) => {
  try {
    await dbPool.query('SELECT 1')
    return res.json({ ok: true, db: 'connected' })
  } catch {
    return res.status(500).json({ ok: false, db: 'disconnected' })
  }
})

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/recipes', recipeRoutes)

app.use((_req, res) => {
  return res.status(404).json({ message: 'Route not found.' })
})

app.listen(port, () => {
  // Keep startup output minimal and clear for local testing.
  console.log(`RecipeHub backend listening on http://localhost:${port}`)
})
