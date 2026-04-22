import { Router } from 'express'
import { dbPool } from '../config/db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { uploadRecipeImage } from '../middleware/upload.js'
import { verifyAccessToken } from '../services/tokenService.js'

const router = Router()

function toBool(value) {
  return Boolean(Number(value))
}

function mapRecipeRow(row) {
  return {
    id: String(row.id),
    title: row.title,
    summary: row.summary,
    category: row.category,
    course: row.course_type || row.category,
    difficulty: row.difficulty,
    duration: row.duration_minutes,
    time: `${row.duration_minutes} mins`,
    image: row.image_url || null,
    premium: toBool(row.is_premium),
    status: row.status,
    submittedBy: row.submitted_by,
    submittedByName: row.staff_name,
    likes: Number(row.like_count || 0),
    rating: Number(row.like_count || 0) > 0 ? Math.min(5, 4 + Number(row.like_count || 0) / 20).toFixed(1) : '4.0',
    commentsCount: Number(row.comment_count || 0),
    favoritesCount: Number(row.favorite_count || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function sanitizeComment(comment) {
  return {
    id: Number(comment.id),
    recipeId: String(comment.recipe_id),
    userId: Number(comment.user_id),
    author: comment.full_name,
    message: comment.comment_text,
    createdAt: comment.created_at,
  }
}

function getOptionalUser(req) {
  const authHeader = req.headers.authorization || ''
  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return null
  }

  try {
    return verifyAccessToken(token)
  } catch {
    return null
  }
}

async function getRecipeById(recipeId) {
  const [rows] = await dbPool.execute(
    `SELECT
      r.id,
      r.title,
      r.summary,
      r.category,
      r.course_type,
      r.difficulty,
      r.duration_minutes,
      r.image_url,
      r.is_premium,
      r.status,
      r.submitted_by,
      r.created_at,
      r.updated_at,
      u.full_name AS staff_name,
      (SELECT COUNT(*) FROM recipe_likes rl WHERE rl.recipe_id = r.id) AS like_count,
      (SELECT COUNT(*) FROM recipe_comments rc WHERE rc.recipe_id = r.id) AS comment_count,
      (SELECT COUNT(*) FROM recipe_favorites rf WHERE rf.recipe_id = r.id) AS favorite_count
    FROM recipes r
    INNER JOIN users u ON u.id = r.submitted_by
    WHERE r.id = ?
    LIMIT 1`,
    [recipeId],
  )

  if (!rows.length) {
    return null
  }

  const recipe = mapRecipeRow(rows[0])

  const [ingredients] = await dbPool.execute(
    `SELECT ingredient_text
     FROM recipe_ingredients
     WHERE recipe_id = ?
     ORDER BY sort_order ASC, id ASC`,
    [recipeId],
  )

  const [steps] = await dbPool.execute(
    `SELECT step_text
     FROM recipe_steps
     WHERE recipe_id = ?
     ORDER BY sort_order ASC, id ASC`,
    [recipeId],
  )

  recipe.ingredients = ingredients.map((item) => item.ingredient_text)
  recipe.instructions = steps.map((item) => item.step_text)
  recipe.steps = recipe.instructions

  return recipe
}

router.get('/categories', async (_req, res) => {
  try {
    const [rows] = await dbPool.execute(
      `SELECT DISTINCT category
       FROM recipes
       WHERE status = 'approved'
       ORDER BY category ASC`,
    )

    return res.json({ categories: rows.map((row) => row.category) })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch categories.', error: error.message })
  }
})

router.get('/', async (req, res) => {
  const user = getOptionalUser(req)
  const {
    search = '',
    category,
    difficulty,
    status,
    mine,
    favorites,
    page = '1',
    limit = '30',
  } = req.query

  const where = []
  const params = []

  if (!user || user.role === 'customer') {
    where.push(`r.status = 'approved'`)
  }

  if (status) {
    const allowedStatus = ['approved', 'pending', 'rejected']

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'status must be approved, pending, or rejected.' })
    }

    if (!user || user.role !== 'admin') {
      if (!(user && user.role === 'staff' && mine === '1')) {
        return res.status(403).json({ message: 'Only admins can filter by status globally.' })
      }
    }

    where.push('r.status = ?')
    params.push(status)
  }

  if (mine === '1') {
    if (!user || !['staff', 'admin'].includes(user.role)) {
      return res.status(403).json({ message: 'mine=1 is only available for staff or admin.' })
    }

    if (user.role === 'staff') {
      where.push('r.submitted_by = ?')
      params.push(user.sub)
    }
  }

  let joinFavorite = ''
  if (favorites === '1') {
    if (!user) {
      return res.status(401).json({ message: 'Login required to view favorites.' })
    }

    joinFavorite = 'INNER JOIN recipe_favorites my_fav ON my_fav.recipe_id = r.id AND my_fav.user_id = ?'
    params.push(user.sub)
  }

  if (search.trim()) {
    where.push('(r.title LIKE ? OR r.summary LIKE ?)')
    params.push(`%${search.trim()}%`, `%${search.trim()}%`)
  }

  if (category && category !== 'All') {
    where.push('r.category = ?')
    params.push(category)
  }

  if (difficulty && difficulty !== 'All') {
    where.push('r.difficulty = ?')
    params.push(difficulty)
  }

  const pageNumber = Math.max(1, Number(page) || 1)
  const limitNumber = Math.max(1, Math.min(100, Number(limit) || 30))
  const offset = (pageNumber - 1) * limitNumber

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''

  try {
    const [rows] = await dbPool.execute(
      `SELECT
        r.id,
        r.title,
        r.summary,
        r.category,
        r.course_type,
        r.difficulty,
        r.duration_minutes,
        r.image_url,
        r.is_premium,
        r.status,
        r.submitted_by,
        r.created_at,
        r.updated_at,
        u.full_name AS staff_name,
        (SELECT COUNT(*) FROM recipe_likes rl WHERE rl.recipe_id = r.id) AS like_count,
        (SELECT COUNT(*) FROM recipe_comments rc WHERE rc.recipe_id = r.id) AS comment_count,
        (SELECT COUNT(*) FROM recipe_favorites rf WHERE rf.recipe_id = r.id) AS favorite_count
      FROM recipes r
      INNER JOIN users u ON u.id = r.submitted_by
      ${joinFavorite}
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, limitNumber, offset],
    )

    const [countRows] = await dbPool.execute(
      `SELECT COUNT(*) AS total
       FROM recipes r
       ${joinFavorite}
       ${whereClause}`,
      params,
    )

    return res.json({
      recipes: rows.map(mapRecipeRow),
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: Number(countRows[0]?.total || 0),
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch recipes.', error: error.message })
  }
})

router.get('/:recipeId', async (req, res) => {
  const user = getOptionalUser(req)

  try {
    const recipe = await getRecipeById(req.params.recipeId)

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' })
    }

    if (recipe.status !== 'approved') {
      if (!user) {
        return res.status(404).json({ message: 'Recipe not found.' })
      }

      const canView = user.role === 'admin' || recipe.submittedBy === user.sub
      if (!canView) {
        return res.status(403).json({ message: 'Forbidden: recipe is not yet approved.' })
      }
    }

    let liked = false
    let favorited = false

    if (user) {
      const [likedRows] = await dbPool.execute(
        'SELECT recipe_id FROM recipe_likes WHERE recipe_id = ? AND user_id = ? LIMIT 1',
        [req.params.recipeId, user.sub],
      )
      liked = likedRows.length > 0

      const [favoriteRows] = await dbPool.execute(
        'SELECT recipe_id FROM recipe_favorites WHERE recipe_id = ? AND user_id = ? LIMIT 1',
        [req.params.recipeId, user.sub],
      )
      favorited = favoriteRows.length > 0
    }

    const [commentRows] = await dbPool.execute(
      `SELECT rc.id, rc.recipe_id, rc.user_id, rc.comment_text, rc.created_at, u.full_name
       FROM recipe_comments rc
       INNER JOIN users u ON u.id = rc.user_id
       WHERE rc.recipe_id = ?
       ORDER BY rc.created_at DESC`,
      [req.params.recipeId],
    )

    return res.json({
      recipe: {
        ...recipe,
        liked,
        favorited,
        comments: commentRows.map(sanitizeComment),
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch recipe.', error: error.message })
  }
})

router.post('/', requireAuth, requireRole('staff', 'admin'), uploadRecipeImage.single('imageFile'), async (req, res) => {
  const body = req.body || {}

  const title = body.title
  const summary = body.summary || ''
  const category = body.category
  const course = body.course
  const difficulty = body.difficulty || 'Beginner'
  const duration = body.duration
  const premium = body.premium === true || body.premium === 'true' || body.premium === '1'

  let ingredients = body.ingredients
  let instructions = body.instructions

  if (typeof ingredients === 'string') {
    try {
      ingredients = JSON.parse(ingredients)
    } catch {
      ingredients = ingredients.split('\n').map((item) => item.trim()).filter(Boolean)
    }
  }

  if (typeof instructions === 'string') {
    try {
      instructions = JSON.parse(instructions)
    } catch {
      instructions = instructions.split('\n').map((item) => item.trim()).filter(Boolean)
    }
  }

  if (!title || !category || !duration || !Array.isArray(ingredients) || !Array.isArray(instructions)) {
    return res.status(400).json({
      message: 'title, category, duration, ingredients[], and instructions[] are required.',
    })
  }

  const cleanIngredients = ingredients.map((item) => String(item || '').trim()).filter(Boolean)
  const cleanInstructions = instructions.map((item) => String(item || '').trim()).filter(Boolean)

  if (!cleanIngredients.length || !cleanInstructions.length) {
    return res.status(400).json({ message: 'At least 1 ingredient and 1 instruction are required.' })
  }

  const allowedDifficulty = ['Beginner', 'Intermediate', 'Advanced']
  if (!allowedDifficulty.includes(difficulty)) {
    return res.status(400).json({ message: 'difficulty must be Beginner, Intermediate, or Advanced.' })
  }

  const connection = await dbPool.getConnection()

  try {
    await connection.beginTransaction()

    const uploadedImagePath = req.file ? `/uploads/recipes/${req.file.filename}` : null

    const [result] = await connection.execute(
      `INSERT INTO recipes
       (title, summary, category, course_type, difficulty, duration_minutes, image_url, is_premium, status, submitted_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        title,
        summary,
        category,
        course || category,
        difficulty,
        Number(duration),
        uploadedImagePath,
        premium ? 1 : 0,
        req.user.sub,
      ],
    )

    const recipeId = result.insertId

    for (let i = 0; i < cleanIngredients.length; i += 1) {
      await connection.execute(
        'INSERT INTO recipe_ingredients (recipe_id, ingredient_text, sort_order) VALUES (?, ?, ?)',
        [recipeId, cleanIngredients[i], i + 1],
      )
    }

    for (let i = 0; i < cleanInstructions.length; i += 1) {
      await connection.execute(
        'INSERT INTO recipe_steps (recipe_id, step_text, sort_order) VALUES (?, ?, ?)',
        [recipeId, cleanInstructions[i], i + 1],
      )
    }

    await connection.commit()

    const recipe = await getRecipeById(recipeId)

    return res.status(201).json({
      message: 'Recipe submitted successfully and is pending review.',
      recipe,
    })
  } catch (error) {
    await connection.rollback()
    return res.status(500).json({ message: 'Failed to create recipe.', error: error.message })
  } finally {
    connection.release()
  }
})

router.patch('/:recipeId/status', requireAuth, requireRole('admin'), async (req, res) => {
  const { status } = req.body || {}

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'status must be approved, rejected, or pending.' })
  }

  try {
    const [rows] = await dbPool.execute('SELECT id FROM recipes WHERE id = ? LIMIT 1', [req.params.recipeId])

    if (!rows.length) {
      return res.status(404).json({ message: 'Recipe not found.' })
    }

    await dbPool.execute(
      'UPDATE recipes SET status = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ?',
      [status, req.user.sub, req.params.recipeId],
    )

    const recipe = await getRecipeById(req.params.recipeId)

    return res.json({ message: 'Recipe status updated.', recipe })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update status.', error: error.message })
  }
})

router.post('/:recipeId/favorite', requireAuth, async (req, res) => {
  try {
    const [existsRows] = await dbPool.execute('SELECT id FROM recipes WHERE id = ? LIMIT 1', [req.params.recipeId])

    if (!existsRows.length) {
      return res.status(404).json({ message: 'Recipe not found.' })
    }

    const [rows] = await dbPool.execute(
      'SELECT recipe_id FROM recipe_favorites WHERE recipe_id = ? AND user_id = ? LIMIT 1',
      [req.params.recipeId, req.user.sub],
    )

    if (rows.length) {
      await dbPool.execute('DELETE FROM recipe_favorites WHERE recipe_id = ? AND user_id = ?', [req.params.recipeId, req.user.sub])
      return res.json({ message: 'Removed from favorites.', favorited: false })
    }

    await dbPool.execute('INSERT INTO recipe_favorites (recipe_id, user_id) VALUES (?, ?)', [req.params.recipeId, req.user.sub])
    return res.json({ message: 'Saved to favorites.', favorited: true })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update favorite.', error: error.message })
  }
})

router.post('/:recipeId/like', requireAuth, async (req, res) => {
  try {
    const [existsRows] = await dbPool.execute('SELECT id FROM recipes WHERE id = ? LIMIT 1', [req.params.recipeId])

    if (!existsRows.length) {
      return res.status(404).json({ message: 'Recipe not found.' })
    }

    const [rows] = await dbPool.execute(
      'SELECT recipe_id FROM recipe_likes WHERE recipe_id = ? AND user_id = ? LIMIT 1',
      [req.params.recipeId, req.user.sub],
    )

    if (rows.length) {
      await dbPool.execute('DELETE FROM recipe_likes WHERE recipe_id = ? AND user_id = ?', [req.params.recipeId, req.user.sub])
      return res.json({ message: 'Like removed.', liked: false })
    }

    await dbPool.execute('INSERT INTO recipe_likes (recipe_id, user_id) VALUES (?, ?)', [req.params.recipeId, req.user.sub])
    return res.json({ message: 'Recipe liked.', liked: true })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to toggle like.', error: error.message })
  }
})

router.post('/:recipeId/comments', requireAuth, async (req, res) => {
  const { message } = req.body || {}

  if (!String(message || '').trim()) {
    return res.status(400).json({ message: 'message is required.' })
  }

  try {
    const [existsRows] = await dbPool.execute('SELECT id FROM recipes WHERE id = ? LIMIT 1', [req.params.recipeId])

    if (!existsRows.length) {
      return res.status(404).json({ message: 'Recipe not found.' })
    }

    const [result] = await dbPool.execute(
      'INSERT INTO recipe_comments (recipe_id, user_id, comment_text) VALUES (?, ?, ?)',
      [req.params.recipeId, req.user.sub, String(message).trim()],
    )

    const [rows] = await dbPool.execute(
      `SELECT rc.id, rc.recipe_id, rc.user_id, rc.comment_text, rc.created_at, u.full_name
       FROM recipe_comments rc
       INNER JOIN users u ON u.id = rc.user_id
       WHERE rc.id = ?
       LIMIT 1`,
      [result.insertId],
    )

    return res.status(201).json({ message: 'Comment posted.', comment: sanitizeComment(rows[0]) })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to post comment.', error: error.message })
  }
})

router.delete('/:recipeId/comments/:commentId', requireAuth, async (req, res) => {
  try {
    const [rows] = await dbPool.execute(
      'SELECT id, user_id FROM recipe_comments WHERE id = ? AND recipe_id = ? LIMIT 1',
      [req.params.commentId, req.params.recipeId],
    )

    if (!rows.length) {
      return res.status(404).json({ message: 'Comment not found.' })
    }

    const comment = rows[0]

    if (req.user.role !== 'admin' && Number(comment.user_id) !== Number(req.user.sub)) {
      return res.status(403).json({ message: 'Forbidden: you can only delete your own comments.' })
    }

    await dbPool.execute('DELETE FROM recipe_comments WHERE id = ?', [req.params.commentId])

    return res.json({ message: 'Comment deleted.' })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete comment.', error: error.message })
  }
})

router.use((error, _req, res, next) => {
  if (!error) {
    next()
    return
  }

  if (error.message.includes('Only image files are allowed')) {
    res.status(400).json({ message: error.message })
    return
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ message: 'Image size must be 5MB or less.' })
    return
  }

  next(error)
})

export { router as recipeRoutes }
