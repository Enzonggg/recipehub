import { useEffect, useState } from 'react'
import { listRecipesApi } from '../../services/recipeApi.js'
import { applyRecipeUiState } from '../../utils/staffRecipeUiStore.js'

export function StaffRecipeStatusPage({ status, title }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let mounted = true

    const loadRows = async () => {
      setLoading(true)
      setErrorMessage('')

      try {
        const response = await listRecipesApi({ mine: 1, status, limit: 120 })
        if (mounted) {
          const uiRows = applyRecipeUiState(response.recipes || []).filter((recipe) => !recipe.isArchived)
          setRows(uiRows)
        }
      } catch (error) {
        if (mounted) {
          setErrorMessage(error.message || 'Failed to fetch recipes.')
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
  }, [status])

  return (
    <section className="panel-section">
      <h1 className="mb-6 text-4xl font-bold">{title}</h1>
      {loading ? <p className="mb-4">Loading recipes...</p> : null}
      {errorMessage ? <p className="mb-4 text-error">{errorMessage}</p> : null}
      <div className="overflow-x-auto">
        <table className="panel-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Duration (Mins)</th>
              <th>Premium</th>
              <th>Date Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.title}</td>
                <td>
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                  {row.duration}
                </td>
                <td>{row.premium ? 'Yes' : 'No'}</td>
                <td>{new Date(row.createdAt).toLocaleString()}</td>
                <td><button className="panel-btn" type="button">#{row.id}</button></td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center opacity-70">No recipes in this status yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}
