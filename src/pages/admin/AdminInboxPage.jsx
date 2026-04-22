import { inboxMessages } from '../../data/panelMockData.js'

export function AdminInboxPage() {
  return (
    <section className="panel-section">
      <h1 className="mb-6 text-4xl font-bold">Inbox</h1>
      <div className="space-y-4">
        {inboxMessages.map((message) => (
          <article key={message.id} className="panel-card border-l-4 border-l-primary p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{message.subject}</p>
            <h2 className="mt-1 text-2xl font-bold">{message.from}</h2>
            <p className="text-sm opacity-70">{message.email}</p>
            <p className="mt-3 opacity-90">{message.message}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
