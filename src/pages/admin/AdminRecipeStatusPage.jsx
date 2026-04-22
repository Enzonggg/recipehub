import { useEffect, useState } from 'react'
import { listRecipesApi, updateRecipeStatusApi } from '../../services/recipeApi.js'

export function AdminRecipeStatusPage({ status, title }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const loadRows = async () => {
    setLoading(true)
    setErrorMessage('')

    try {
      const response = await listRecipesApi({ status, limit: 120 })
      setRows(response.recipes || [])
    } catch (error) {
      setErrorMessage(error.message || 'Failed to fetch recipes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRows()
  }, [status])

  const updateStatus = async (recipeId, nextStatus) => {
    try {
      await updateRecipeStatusApi(recipeId, nextStatus)
      await loadRows()
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update recipe status.')
    }
  }

  return (
    <section className="panel-section">
      <h1 className="mb-6 text-4xl font-bold">{title}</h1>
      {loading ? <p className="mb-4">Loading recipes...</p> : null}
      {errorMessage ? <p className="mb-4 text-error">{errorMessage}</p> : null}
      <div className="panel-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="panel-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Premium</th>
              <th>Staff</th>
              <th>Submitted On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover">
                <td>{row.title}</td>
                <td>
                  <span className={`badge badge-sm ${row.premium ? 'badge-success' : 'badge-ghost'}`}>{row.premium ? 'Yes' : 'No'}</span>
                </td>
                <td>{row.submittedByName}</td>
                <td>{new Date(row.createdAt).toLocaleString()}</td>
                <td className="space-x-2">
                  {status === 'pending' ? (
                    <>
                      <button className="btn btn-xs btn-success" onClick={() => updateStatus(row.id, 'approved')} type="button">Approve</button>
                      <button className="btn btn-xs btn-error" onClick={() => updateStatus(row.id, 'rejected')} type="button">Reject</button>
                    </>
                  ) : (
                    <button className="btn btn-xs btn-info text-info-content" type="button">#{row.id}</button>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center opacity-70">No recipes in this status.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      </div>
    </section>
  )
}
