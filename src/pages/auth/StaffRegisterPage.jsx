import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerStaffApi } from '../../services/authApi.js'
import { isRoleAuthenticated, setAuthSession } from '../../utils/authSession.js'

export function StaffRegisterPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!isRoleAuthenticated('staff')) {
      return
    }

    navigate('/staff', { replace: true })
  }, [navigate])

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
      const response = await registerStaffApi({ fullName, email, password })
      setAuthSession({ token: response.token, user: response.user })
      navigate('/staff')
    } catch (error) {
      setErrorMessage(error.message || 'Staff registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-shell py-14">
      <div className="mx-auto max-w-xl rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <h1 className="text-3xl">Create a staff account</h1>
        <p className="mt-2 text-sm opacity-75">Staff accounts can submit recipes and monitor sales and payout metrics.</p>

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
            {isSubmitting ? 'Creating account...' : 'Register as Staff'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm">
          Already have a staff account? <Link className="link link-primary" to="/login/staff">Login here</Link>
        </p>
      </div>
    </section>
  )
}
