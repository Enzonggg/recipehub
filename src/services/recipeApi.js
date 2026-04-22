import { getAuthToken } from '../utils/authSession.js'
import { apiRequest, createAuthHeaders, resolveApiAssetUrl } from './apiClient.js'

function buildAuthHeaders() {
  const token = getAuthToken()
  return token ? createAuthHeaders(token) : {}
}

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }

    searchParams.set(key, String(value))
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

function normalizeRecipe(recipe) {
  if (!recipe) {
    return recipe
  }

  return {
    ...recipe,
    image: resolveApiAssetUrl(recipe.image),
  }
}

export function listRecipesApi(params = {}) {
  return apiRequest(`/api/recipes${buildQuery(params)}`, {
    method: 'GET',
    headers: buildAuthHeaders(),
  }).then((data) => ({
    ...data,
    recipes: (data.recipes || []).map(normalizeRecipe),
  }))
}

export function getRecipeByIdApi(recipeId) {
  return apiRequest(`/api/recipes/${recipeId}`, {
    method: 'GET',
    headers: buildAuthHeaders(),
  }).then((data) => ({
    ...data,
    recipe: normalizeRecipe(data.recipe),
  }))
}

export function listRecipeCategoriesApi() {
  return apiRequest('/api/recipes/categories', {
    method: 'GET',
    headers: buildAuthHeaders(),
  })
}

export function createRecipeApi(payload) {
  const formData = new FormData()
  formData.append('title', payload.title || '')
  formData.append('summary', payload.summary || '')
  formData.append('category', payload.category || '')
  formData.append('course', payload.course || payload.category || '')
  formData.append('difficulty', payload.difficulty || 'Beginner')
  formData.append('duration', String(payload.duration || ''))
  formData.append('premium', payload.premium ? 'true' : 'false')
  formData.append('ingredients', JSON.stringify(payload.ingredients || []))
  formData.append('instructions', JSON.stringify(payload.instructions || []))
  formData.append('videoUrl', payload.videoUrl || '')

  if (payload.imageFile) {
    formData.append('imageFile', payload.imageFile)
  }

  return apiRequest('/api/recipes', {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: formData,
  })
}

export function updateRecipeStatusApi(recipeId, status) {
  return apiRequest(`/api/recipes/${recipeId}/status`, {
    method: 'PATCH',
    headers: buildAuthHeaders(),
    body: JSON.stringify({ status }),
  })
}

export function toggleRecipeFavoriteApi(recipeId) {
  return apiRequest(`/api/recipes/${recipeId}/favorite`, {
    method: 'POST',
    headers: buildAuthHeaders(),
  })
}

export function toggleRecipeLikeApi(recipeId) {
  return apiRequest(`/api/recipes/${recipeId}/like`, {
    method: 'POST',
    headers: buildAuthHeaders(),
  })
}

export function postRecipeCommentApi(recipeId, message) {
  return apiRequest(`/api/recipes/${recipeId}/comments`, {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: JSON.stringify({ message }),
  })
}

export function deleteRecipeCommentApi(recipeId, commentId) {
  return apiRequest(`/api/recipes/${recipeId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: buildAuthHeaders(),
  })
}
