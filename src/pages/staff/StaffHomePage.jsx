import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listRecipesApi } from '../../services/recipeApi.js'
import { applyRecipeUiState, archiveRecipe, saveRecipeOverride } from '../../utils/staffRecipeUiStore.js'

export function StaffHomePage() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [message, setMessage] = useState('')
  const [editingRecipeId, setEditingRecipeId] = useState('')
  const [editForm, setEditForm] = useState({
    title: '',
    summary: '',
    category: 'Main Course',
    duration: '',
    premium: false,
    videoUrl: '',
  })

  useEffect(() => {
    let mounted = true

    const loadRows = async () => {
      setLoading(true)
      setErrorMessage('')

      try {
        const response = await listRecipesApi({ mine: 1, limit: 120 })
        if (mounted) {
          setRecipes(applyRecipeUiState(response.recipes || []))
        }
      } catch (error) {
        if (mounted) {
          setErrorMessage(error.message || 'Failed to load recipes.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadRows()

    return () => {
      mounted = false
    }
  }, [])

  const activeRecipes = useMemo(() => {
    return recipes.filter((recipe) => !recipe.isArchived)
  }, [recipes])

  const startEdit = (recipe) => {
    setEditingRecipeId(String(recipe.id))
    setEditForm({
      title: recipe.title || '',
      summary: recipe.summary || '',
      category: recipe.category || recipe.course || 'Main Course',
      duration: String(recipe.duration || ''),
      premium: Boolean(recipe.premium),
      videoUrl: recipe.videoUrl || '',
    })
    setMessage('')
    setErrorMessage('')
  }

  const cancelEdit = () => {
    setEditingRecipeId('')
  }

  const saveEdit = () => {
    if (!editingRecipeId) {
      return
    }

    if (!editForm.title.trim()) {
      setErrorMessage('Recipe title is required.')
      return
    }

    const normalizedDuration = Number(editForm.duration || 0)

    if (!Number.isFinite(normalizedDuration) || normalizedDuration <= 0) {
      setErrorMessage('Duration must be greater than zero.')
      return
    }

    saveRecipeOverride(editingRecipeId, {
      title: editForm.title,
      summary: editForm.summary,
      category: editForm.category,
      duration: normalizedDuration,
      premium: editForm.premium,
      videoUrl: editForm.videoUrl,
    })

    setRecipes((state) => {
      const next = state.map((recipe) => {
        if (String(recipe.id) !== editingRecipeId) {
          return recipe
        }

        return {
          ...recipe,
          title: editForm.title,
          summary: editForm.summary,
          category: editForm.category,
          course: editForm.category,
          duration: normalizedDuration,
          time: `${normalizedDuration} mins`,
          premium: editForm.premium,
          videoUrl: editForm.videoUrl,
          isLocallyEdited: true,
        }
      })

      return applyRecipeUiState(next)
    })

    setEditingRecipeId('')
    setMessage('Recipe details updated in frontend view.')
    setErrorMessage('')
  }

  const archiveItem = (recipeId) => {
    archiveRecipe(recipeId)
    setRecipes((state) => applyRecipeUiState(state))
    setMessage('Recipe moved to archive.')
    setErrorMessage('')
  }

  return (
    <section className="panel-section">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-bold">My Recipe Home</h1>
          <p className="mt-1 text-sm opacity-70">Card view of your submitted recipes with quick edit and archive actions.</p>
        </div>
        <Link className="btn btn-primary" to="/staff/add">Add New Recipe</Link>
      </div>

      {message ? <p className="mb-3 text-success">{message}</p> : null}
      {errorMessage ? <p className="mb-3 text-error">{errorMessage}</p> : null}

      {editingRecipeId ? (
        <article className="panel-card mb-6 p-5">
          <h2 className="text-2xl font-semibold">Edit Recipe</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm">Title</span>
              <input
                className="panel-input"
                value={editForm.title}
                onChange={(event) => setEditForm((prev) => ({ ...prev, title: event.target.value }))}
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm">Summary</span>
              <textarea
                className="panel-input min-h-24"
                value={editForm.summary}
                onChange={(event) => setEditForm((prev) => ({ ...prev, summary: event.target.value }))}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm">Category</span>
              <select
                className="panel-input"
                value={editForm.category}
                onChange={(event) => setEditForm((prev) => ({ ...prev, category: event.target.value }))}
              >
                <option>Appetizer</option>
                <option>Main Course</option>
                <option>Dessert</option>
                <option>Healthy</option>
                <option>Quick Meals</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm">Duration (minutes)</span>
              <input
                className="panel-input"
                type="number"
                min="1"
                value={editForm.duration}
                onChange={(event) => setEditForm((prev) => ({ ...prev, duration: event.target.value }))}
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm">Video URL (optional)</span>
              <input
                className="panel-input"
                type="url"
                value={editForm.videoUrl}
                onChange={(event) => setEditForm((prev) => ({ ...prev, videoUrl: event.target.value }))}
              />
            </label>

            <label className="flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                checked={editForm.premium}
                onChange={(event) => setEditForm((prev) => ({ ...prev, premium: event.target.checked }))}
              />
              <span className="text-sm">Mark as Premium</span>
            </label>
          </div>

          <div className="mt-4 flex gap-2">
            <button className="btn btn-primary" type="button" onClick={saveEdit}>Save Changes</button>
            <button className="btn btn-outline" type="button" onClick={cancelEdit}>Cancel</button>
          </div>
        </article>
      ) : null}

      {loading ? <p className="mb-4">Loading your recipes...</p> : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {activeRecipes.map((recipe) => (
          <article key={recipe.id} className="panel-card overflow-hidden">
            <img src={recipe.image || '/recipe-placeholder.svg'} alt={recipe.title} className="h-44 w-full object-cover" />
            <div className="p-4">
              <div className="mb-2 flex flex-wrap gap-2">
                <span className="badge badge-outline">{recipe.category || recipe.course}</span>
                <span className={`badge ${recipe.status === 'approved' ? 'badge-success' : recipe.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                  {recipe.status}
                </span>
                {recipe.premium ? <span className="badge badge-warning">Premium</span> : null}
              </div>
              <h3 className="text-xl font-semibold">{recipe.title}</h3>
              <p className="mt-1 line-clamp-3 text-sm opacity-75">{recipe.summary || 'No summary provided.'}</p>
              <p className="mt-2 text-xs opacity-70">{recipe.duration} mins</p>

              <div className="mt-4 flex gap-2">
                <button className="btn btn-sm btn-outline" type="button" onClick={() => startEdit(recipe)}>Edit</button>
                <button className="btn btn-sm btn-error" type="button" onClick={() => archiveItem(recipe.id)}>Archive</button>
              </div>
            </div>
          </article>
        ))}

        {!loading && activeRecipes.length === 0 ? (
          <article className="panel-card p-5">
            <h3 className="text-lg font-semibold">No active recipes</h3>
            <p className="mt-2 text-sm opacity-75">Add a new recipe or restore one from the archive section.</p>
            <Link className="btn btn-outline btn-sm mt-4" to="/staff/archive">Open Archive</Link>
          </article>
        ) : null}
      </div>
    </section>
  )
}
