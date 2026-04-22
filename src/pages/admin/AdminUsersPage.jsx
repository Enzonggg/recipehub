import { useEffect, useMemo, useState } from 'react'
import { adminUsers } from '../../data/panelMockData.js'

const tabs = ['Subscribed', 'Not Subscribed', 'Banned Users']
const PAGE_SIZE = 5

export function AdminUsersPage() {
  const [users, setUsers] = useState(adminUsers)
  const [activeTab, setActiveTab] = useState('Subscribed')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const rowsByTab = useMemo(() => {
    if (activeTab === 'Banned Users') {
      return users.filter((user) => user.banned)
    }
    return users.filter((user) => !user.banned && user.subscription === activeTab)
  }, [activeTab, users])

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) {
      return rowsByTab
    }

    return rowsByTab.filter((user) => {
      return (
        user.name.toLowerCase().includes(term)
        || user.username.toLowerCase().includes(term)
        || user.email.toLowerCase().includes(term)
      )
    })
  }, [rowsByTab, search])

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return rows.slice(start, start + PAGE_SIZE)
  }, [rows, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, search])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const toggleBan = (id) => {
    setUsers((state) => state.map((user) => (user.id === id ? { ...user, banned: !user.banned } : user)))
  }

  return (
    <section className="panel-section">
      <h1 className="mb-5 text-4xl font-bold">Manage Users</h1>

      <div className="tabs tabs-boxed mb-4 inline-flex gap-1 bg-base-200/80 p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab border-0 ${activeTab === tab ? 'tab-active !bg-primary !text-primary-content' : ''}`}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <label className="form-control w-full max-w-sm">
          <span className="label-text mb-1 text-sm">Search users</span>
          <input
            className="input input-bordered"
            placeholder="Name, username, or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <p className="text-sm opacity-70">Showing up to {PAGE_SIZE} users per page</p>
      </div>

      <div className="panel-card overflow-hidden">
        <div className="overflow-x-auto">
        <table className="panel-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((user) => (
              <tr key={user.id} className="hover">
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    onClick={() => toggleBan(user.id)}
                    className={`btn btn-xs ${user.banned ? 'btn-success' : 'btn-error'} text-white`}
                    type="button"
                  >
                    {user.banned ? 'Unban' : 'Ban'}
                  </button>
                </td>
              </tr>
            ))}
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center opacity-70">No users found for this filter.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm opacity-70">Page {currentPage} of {totalPages}</p>
        <div className="join">
          <button
            className="btn btn-sm join-item"
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              className={`btn btn-sm join-item ${page === currentPage ? 'btn-primary' : ''}`}
              type="button"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="btn btn-sm join-item"
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}
