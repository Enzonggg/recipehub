import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { loginApi } from '../../services/authApi.js'
import { isRoleAuthenticated, setAuthSession } from '../../utils/authSession.js'

export function RoleLoginCard({
  role,
  subtitle,
  image,
  loginPath,
  registerPath,
  panelTone = 'from-primary/75 to-secondary/65',
}) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const normalizedRole = role.toLowerCase()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!isRoleAuthenticated(normalizedRole)) {
      return
    }

    const requestedPath = searchParams.get('next')
    const hasSafeNextPath = requestedPath && requestedPath.startsWith('/') && !requestedPath.startsWith('//')
    const destination = normalizedRole === 'customer' && hasSafeNextPath ? requestedPath : loginPath

    navigate(destination, { replace: true })
  }, [loginPath, navigate, normalizedRole, searchParams])

  const handleLogin = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (!identifier || !password) {
      setErrorMessage('Please complete your credentials.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await loginApi({
        role: normalizedRole,
        identifier,
        password,
      })

      setAuthSession({ token: response.token, user: response.user })

      const requestedPath = searchParams.get('next')
      const hasSafeNextPath = requestedPath && requestedPath.startsWith('/') && !requestedPath.startsWith('//')
      const destination = normalizedRole === 'customer' && hasSafeNextPath ? requestedPath : loginPath

      navigate(destination)
    } catch (error) {
      setErrorMessage(error.message || 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-shell auth-page-center py-10">
      <div className="auth-split-shell">
        <aside className="auth-visual" style={{ backgroundImage: `url(${image})` }}>
          <div className={`auth-overlay bg-gradient-to-br ${panelTone}`}>
            <p className="auth-kicker">RecipeHub</p>
            <h1 className="auth-role">{role} Portal</h1>
            <p className="auth-subtext">{subtitle}</p>
          </div>
        </aside>

        <div className="auth-form-panel">
          <div className="max-w-md">
            <h2 className="text-3xl">Sign in as {role}</h2>
            <p className="mt-2 text-sm opacity-75">Use your {role.toLowerCase()} credentials to continue.</p>

            <form className="mt-6 space-y-3" onSubmit={handleLogin}>
              <label className="form-control">
                <span className="label-text mb-1 text-sm">Email</span>
                <input
                  className="input input-bordered w-full"
                  placeholder="you@example.com"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                />
              </label>

              <label className="form-control">
                <span className="label-text mb-1 text-sm">Password</span>
                <input
                  className="input input-bordered w-full"
                  placeholder="Enter password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>

              {errorMessage ? <p className="text-sm text-error">{errorMessage}</p> : null}

              <button className="btn btn-primary mt-2 w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {registerPath ? (
              <p className="mt-4 text-sm">
                Need a new account? <Link className="link link-primary" to={registerPath}>Create account</Link>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
