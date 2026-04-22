import { useEffect, useState } from 'react'
import { deleteStaffApi, listStaffApi, updateStaffApi } from '../../services/authApi.js'
import { getAuthToken } from '../../utils/authSession.js'

export function AdminCreateStaffPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ fullName: '', email: '', isActive: true })
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const loadStaff = async () => {
    setErrorMessage('')
    setLoading(true)

    try {
      const token = getAuthToken()
      const response = await listStaffApi(token)
      setRows(response.staff || [])
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load staff accounts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStaff()
  }, [])

  const startEdit = (staff) => {
    setEditingId(staff.id)
    setForm({
      fullName: staff.fullName || '',
      email: staff.email || '',
      isActive: Boolean(staff.isActive),
    })
    setMessage('')
    setErrorMessage('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ fullName: '', email: '', isActive: true })
  }

  const saveEdit = async (staffId) => {
    setMessage('')
    setErrorMessage('')

    if (!form.fullName || !form.email) {
      setErrorMessage('Full name and email are required.')
      return
    }

    try {
      const token = getAuthToken()
      await updateStaffApi(token, staffId, {
        fullName: form.fullName,
        email: form.email,
        isActive: form.isActive,
      })

      setMessage('Staff account updated successfully.')
      cancelEdit()
      await loadStaff()
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update staff account.')
    }
  }

  const deactivateStaff = async (staffId) => {
    setMessage('')
    setErrorMessage('')

    try {
      const token = getAuthToken()
      await deleteStaffApi(token, staffId)
      setMessage('Staff account deactivated successfully.')
      if (editingId === staffId) {
        cancelEdit()
      }
      await loadStaff()
    } catch (error) {
      setErrorMessage(error.message || 'Failed to deactivate staff account.')
    }
  }

  return (
    <section className="panel-section">
      <h1 className="mb-2 text-4xl font-bold">Staff Management</h1>
      <p className="mb-6 text-sm opacity-70">Staff accounts register on their own. Admin can edit profile details and deactivate accounts.</p>

      {message ? <p className="mb-3 text-success">{message}</p> : null}
      {errorMessage ? <p className="mb-3 text-error">{errorMessage}</p> : null}

      <div className="panel-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="panel-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center opacity-70">Loading staff accounts...</td>
                </tr>
              ) : null}

              {!loading && rows.map((staff) => {
                const isEditing = editingId === staff.id

                return (
                  <tr key={staff.id} className="hover">
                    <td>
                      {isEditing ? (
                        <input
                          className="input input-sm input-bordered w-full"
                          value={form.fullName}
                          onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                        />
                      ) : (
                        staff.fullName
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          className="input input-sm input-bordered w-full"
                          type="email"
                          value={form.email}
                          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                        />
                      ) : (
                        staff.email
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={form.isActive}
                            onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
                          />
                          Active
                        </label>
                      ) : (
                        <span className={`badge badge-sm ${staff.isActive ? 'badge-success' : 'badge-ghost'}`}>
                          {staff.isActive ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td>{new Date(staff.createdAt).toLocaleDateString()}</td>
                    <td className="space-x-2">
                      {isEditing ? (
                        <>
                          <button className="btn btn-xs btn-primary" type="button" onClick={() => saveEdit(staff.id)}>Save</button>
                          <button className="btn btn-xs" type="button" onClick={cancelEdit}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-xs btn-outline" type="button" onClick={() => startEdit(staff)}>Edit</button>
                          <button className="btn btn-xs btn-error" type="button" onClick={() => deactivateStaff(staff.id)}>Deactivate</button>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}

              {!loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center opacity-70">No staff accounts yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
