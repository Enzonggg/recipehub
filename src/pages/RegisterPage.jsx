import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { registerCustomerApi } from '../services/authApi.js'
import { isCustomerAuthenticated, setAuthSession } from '../utils/authSession.js'

export function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!isCustomerAuthenticated()) {
      return
    }

    const requestedPath = searchParams.get('next')
    const hasSafeNextPath = requestedPath && requestedPath.startsWith('/') && !requestedPath.startsWith('//')
    navigate(hasSafeNextPath ? requestedPath : '/customer', { replace: true })
  }, [navigate, searchParams])

  const handleRegister = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMessage('Please complete all required fields.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await registerCustomerApi({ fullName, email, password })
      setAuthSession({ token: response.token, user: response.user })

      const requestedPath = searchParams.get('next')
      const hasSafeNextPath = requestedPath && requestedPath.startsWith('/') && !requestedPath.startsWith('//')
      navigate(hasSafeNextPath ? requestedPath : '/customer')
    } catch (error) {
      setErrorMessage(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-shell py-14">
      <div className="mx-auto max-w-xl rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <h1 className="text-3xl">Create an account</h1>
        <p className="mt-2 text-sm opacity-75">Use this sample signup flow to preview role-based frontend modules.</p>

        <form className="mt-6 grid gap-3 md:grid-cols-2" onSubmit={handleRegister}>
          <input
            className="input input-bordered md:col-span-2"
            placeholder="Full Name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
          <input
            className="input input-bordered md:col-span-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className="input input-bordered"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <input
            className="input input-bordered"
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          {errorMessage ? <p className="text-sm text-error md:col-span-2">{errorMessage}</p> : null}
          <button className="btn btn-primary md:col-span-2" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm">
          Already have an account? <Link className="link link-primary" to="/login/customer">Login here</Link>
        </p>
      </div>
    </section>
  )
}
