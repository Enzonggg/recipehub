const ARCHIVED_RECIPES_KEY = 'recipehub-staff-archived-recipes'
const RECIPE_OVERRIDES_KEY = 'recipehub-staff-recipe-overrides'

function readJson(key, fallback) {
  try {
    const rawValue = localStorage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function toNumber(value, fallback = 0) {
  const next = Number(value)
  return Number.isFinite(next) ? next : fallback
}

function normalizeOverride(override = {}) {
  return {
    title: String(override.title || '').trim(),
    summary: String(override.summary || '').trim(),
    category: String(override.category || '').trim(),
    duration: toNumber(override.duration, 0),
    premium: Boolean(override.premium),
    videoUrl: String(override.videoUrl || '').trim(),
    updatedAt: new Date().toISOString(),
  }
}

function applyOverride(recipe, override = {}) {
  if (!recipe) {
    return recipe
  }

  const next = { ...recipe }

  if (override.title) {
    next.title = override.title
  }

  if (override.summary || override.summary === '') {
    next.summary = override.summary
  }

  if (override.category) {
    next.category = override.category
    next.course = override.category
  }

  if (override.duration > 0) {
    next.duration = override.duration
    next.time = `${override.duration} mins`
  }

  if (typeof override.premium === 'boolean') {
    next.premium = override.premium
  }

  if (override.videoUrl || override.videoUrl === '') {
    next.videoUrl = override.videoUrl
  }

  next.isLocallyEdited = true

  return next
}

export function getArchivedRecipeIds() {
  const values = readJson(ARCHIVED_RECIPES_KEY, [])
  return Array.isArray(values) ? values.map((value) => String(value)) : []
}

export function isRecipeArchived(recipeId) {
  return getArchivedRecipeIds().includes(String(recipeId))
}

export function archiveRecipe(recipeId) {
  const current = getArchivedRecipeIds()
  const recipeIdText = String(recipeId)

  if (!current.includes(recipeIdText)) {
    current.push(recipeIdText)
    writeJson(ARCHIVED_RECIPES_KEY, current)
  }

  return current
}

export function unarchiveRecipe(recipeId) {
  const recipeIdText = String(recipeId)
  const next = getArchivedRecipeIds().filter((value) => value !== recipeIdText)
  writeJson(ARCHIVED_RECIPES_KEY, next)
  return next
}

export function getRecipeOverride(recipeId) {
  const allOverrides = readJson(RECIPE_OVERRIDES_KEY, {})
  return allOverrides[String(recipeId)] || null
}

export function saveRecipeOverride(recipeId, override) {
  const allOverrides = readJson(RECIPE_OVERRIDES_KEY, {})
  allOverrides[String(recipeId)] = normalizeOverride(override)
  writeJson(RECIPE_OVERRIDES_KEY, allOverrides)
  return allOverrides[String(recipeId)]
}

export function applyRecipeUiState(recipes = []) {
  const overrides = readJson(RECIPE_OVERRIDES_KEY, {})
  const archivedIds = new Set(getArchivedRecipeIds())

  return recipes.map((recipe) => {
    const recipeId = String(recipe.id)
    const override = overrides[recipeId] || null
    const merged = override ? applyOverride(recipe, override) : { ...recipe }

    return {
      ...merged,
      isArchived: archivedIds.has(recipeId),
    }
  })
}
