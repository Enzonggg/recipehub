import { AuthRequiredModal } from './AuthRequiredModal.jsx'
import { isCustomerAuthenticated } from '../../utils/authSession.js'

export function CustomerOnlyRoute({ children, nextPath }) {
  if (isCustomerAuthenticated()) {
    return children
  }

  return (
    <section className="page-shell py-16">
      <div className="mx-auto max-w-xl rounded-3xl border border-base-300 bg-base-100 p-8 text-center shadow-sm">
        <h1 className="text-3xl">Members-only content</h1>
        <p className="mt-2 text-sm opacity-75">
          This area is available for signed-in customer accounts only.
        </p>
      </div>
      <AuthRequiredModal open={true} nextPath={nextPath} title="Sign in to access this page" closeTo="/" />
    </section>
  )
}
