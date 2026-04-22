import { useEffect, useMemo, useState } from 'react'
import { listRecipesApi } from '../../services/recipeApi.js'
import { applyRecipeUiState, unarchiveRecipe } from '../../utils/staffRecipeUiStore.js'

export function StaffArchivePage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let mounted = true

    const loadRows = async () => {
      setLoading(true)
      setErrorMessage('')

      try {
        const response = await listRecipesApi({ mine: 1, limit: 120 })
        if (mounted) {
          setRows(applyRecipeUiState(response.recipes || []))
        }
      } catch (error) {
        if (mounted) {
          setErrorMessage(error.message || 'Failed to load archived recipes.')
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

  const archivedRows = useMemo(() => {
    return rows.filter((recipe) => recipe.isArchived)
  }, [rows])

  const restoreRecipe = (recipeId) => {
    unarchiveRecipe(recipeId)
    setRows((state) => applyRecipeUiState(state))
    setMessage('Recipe restored from archive.')
  }

  return (
    <section className="panel-section">
      <h1 className="mb-2 text-4xl font-bold">Archived Recipes</h1>
      <p className="mb-6 text-sm opacity-70">Recipes archived from the staff home page appear here.</p>

      {message ? <p className="mb-3 text-success">{message}</p> : null}
      {errorMessage ? <p className="mb-3 text-error">{errorMessage}</p> : null}
      {loading ? <p className="mb-3">Loading archived recipes...</p> : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {archivedRows.map((recipe) => (
          <article key={recipe.id} className="panel-card overflow-hidden">
            <img src={recipe.image || '/recipe-placeholder.svg'} alt={recipe.title} className="h-44 w-full object-cover" />
            <div className="p-4">
              <div className="mb-2 flex flex-wrap gap-2">
                <span className="badge badge-outline">{recipe.category || recipe.course}</span>
                <span className={`badge ${recipe.status === 'approved' ? 'badge-success' : recipe.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                  {recipe.status}
                </span>
              </div>
              <h3 className="text-xl font-semibold">{recipe.title}</h3>
              <p className="mt-1 line-clamp-3 text-sm opacity-75">{recipe.summary || 'No summary provided.'}</p>
              <button className="btn btn-outline btn-sm mt-4" type="button" onClick={() => restoreRecipe(recipe.id)}>
                Unarchive
              </button>
            </div>
          </article>
        ))}

        {!loading && archivedRows.length === 0 ? (
          <article className="panel-card p-5">
            <h3 className="text-lg font-semibold">No archived recipes</h3>
            <p className="mt-2 text-sm opacity-75">Archive recipes from Staff Home to manage your active list.</p>
          </article>
        ) : null}
      </div>
    </section>
  )
}
