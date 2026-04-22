import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="page-shell py-24 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">404</p>
      <h1 className="mt-3 text-5xl">This page is not on the menu.</h1>
      <p className="mx-auto mt-4 max-w-xl opacity-75">
        The link may be outdated or the page might have been moved. Go back and keep cooking.
      </p>
      <Link className="btn btn-primary mt-7" to="/">Back to home</Link>
    </section>
  )
}
