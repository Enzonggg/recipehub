import { useMemo, useState } from 'react'
import { formatPhp, getAdminFinancialSummary } from '../../utils/monetizationStore.js'

export function StaffFinancePage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const summary = useMemo(() => {
    return getAdminFinancialSummary()
  }, [refreshKey])

  const cards = [
    { label: 'Gross Sales', value: formatPhp(summary.grossRevenue), tone: 'from-cyan-500/20 to-sky-500/20' },
    { label: 'Platform Share', value: formatPhp(summary.platformGross), tone: 'from-indigo-500/20 to-violet-500/20' },
    { label: 'Estimated Tax', value: formatPhp(summary.estimatedTax), tone: 'from-rose-500/20 to-orange-500/20' },
    { label: 'Creator Payout', value: formatPhp(summary.chefPayout), tone: 'from-emerald-500/20 to-lime-500/20' },
    { label: 'Ad Revenue Estimate', value: formatPhp(summary.adRevenueMonthly), tone: 'from-amber-500/20 to-yellow-500/20' },
  ]

  return (
    <section className="panel-section">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-bold">Staff Finance Overview</h1>
          <p className="mt-1 text-sm opacity-70">This panel is visible to staff only and tracks platform sales and payout estimates.</p>
        </div>
        <button className="btn btn-outline btn-sm" type="button" onClick={() => setRefreshKey((value) => value + 1)}>
          Refresh
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <article key={card.label} className={`panel-card bg-gradient-to-br ${card.tone} p-6`}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">{card.label}</p>
            <h2 className="mt-2 text-3xl font-semibold">{card.value}</h2>
          </article>
        ))}
      </div>

      <article className="panel-card mt-5 p-6">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
          <p>Total Recipe Purchases: {summary.purchasesCount}</p>
          <p>Total Gift Events: {summary.giftsCount}</p>
          <p>Total Gifted Coins: {summary.giftedCoins}</p>
          <p>Projected Monthly Platform Value: {formatPhp(summary.projectedMonthlyValue)}</p>
        </div>
      </article>
    </section>
  )
}
