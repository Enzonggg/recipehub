import { Link, useNavigate } from 'react-router-dom'

export function AuthRequiredModal({
  open,
  nextPath = '/customer',
  title = 'Please sign in first',
  onClose,
  closeTo = '/',
}) {
  const navigate = useNavigate()
  const encodedNext = encodeURIComponent(nextPath)

  const handleClose = () => {
    if (onClose) {
      onClose()
      return
    }

    navigate(closeTo)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      aria-hidden={!open}
    >
      <button
        className={`absolute inset-0 bg-base-content/40 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        aria-label="Close authentication prompt"
        onClick={handleClose}
        type="button"
      />

      <div
        className={`relative w-full max-w-md rounded-3xl border border-base-300 bg-base-100 p-6 shadow-2xl transition-all duration-300 ${open ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Authentication required"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="btn btn-ghost btn-sm btn-circle absolute right-4 top-4" aria-label="Close" onClick={handleClose} type="button">
          x
        </button>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">RecipeHub Access</p>
        <h2 className="mt-2 text-2xl">{title}</h2>
        <p className="mt-2 text-sm opacity-80">
          You need a customer account to continue. Sign in or register to explore recipes and premium content.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="btn btn-primary" to={`/login/customer?next=${encodedNext}`}>
            Sign in as Customer
          </Link>
          <Link className="btn btn-outline" to={`/register?next=${encodedNext}`}>
            Register account
          </Link>
          <button className="btn btn-ghost" onClick={handleClose} type="button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
