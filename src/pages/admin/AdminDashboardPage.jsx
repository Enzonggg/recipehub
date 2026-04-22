import { useEffect, useState } from 'react'
import { apiRequest, createAuthHeaders } from '../../services/apiClient.js'
import { getAuthToken } from '../../utils/authSession.js'

export function AdminDashboardPage() {
  const [adminStats, setAdminStats] = useState({
    customers: 0,
    staff: 0,
    approved: 0,
    pending: 0,
  })

  useEffect(() => {
    let mounted = true

    const loadStats = async () => {
      try {
        const token = getAuthToken()
        const response = await apiRequest('/api/admin/dashboard-stats', {
          method: 'GET',
          headers: createAuthHeaders(token),
        })

        if (mounted) {
          setAdminStats(response.stats || {})
        }
      } catch {
        if (mounted) {
          setAdminStats({ customers: 0, staff: 0, approved: 0, pending: 0 })
        }
      }
    }

    loadStats()

    return () => {
      mounted = false
    }
  }, [])

  const cards = [
    { label: 'Customers', value: adminStats.customers, tone: 'from-sky-500/20 to-cyan-500/20' },
    { label: 'Staff', value: adminStats.staff, tone: 'from-violet-500/20 to-indigo-500/20' },
    { label: 'Approved Recipes', value: adminStats.approved, tone: 'from-emerald-500/20 to-lime-500/20' },
    { label: 'Pending Recipes', value: adminStats.pending, tone: 'from-amber-500/20 to-orange-500/20' },
  ]

  return (
    <section className="panel-section">
      <h1 className="mb-2 text-4xl font-bold">Admin Dashboard</h1>
      <p className="mb-8 text-sm opacity-70">Snapshot of platform activity and moderation queue.</p>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className={`panel-card bg-gradient-to-br ${card.tone} p-6`}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">{card.label}</p>
            <h2 className="mt-2 text-5xl font-semibold">{card.value}</h2>
          </article>
        ))}
      </div>
    </section>
  )
}
