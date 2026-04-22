import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { clearAuthSession, isRoleAuthenticated } from '../../utils/authSession.js'

const defaultNavItems = [
  { label: 'Home', to: '/', end: true },
  { label: 'Recipes', to: '/customer' },
  { label: 'Community', to: '/community' },
  { label: 'Premium', to: '/premium' },
]

const signedInCustomerNavItems = [
  { label: 'Home', to: '/', end: true },
  { label: 'Recipes', to: '/customer' },
  { label: 'Community', to: '/community' },
  { label: 'Premium', to: '/customer/premium' },
]

export function Navbar({
  navItems = defaultNavItems,
  brandLabel = 'RecipeHub',
  brandTo = '/',
  showSignIn = true,
  signInTo = '/login/customer',
  showLogout = false,
  logoutTo = '/login/customer',
  userLabel = '',
}) {
  const navigate = useNavigate()
  const [theme, setTheme] = useState(localStorage.getItem('recipehub-theme') || 'cupcake')
  const isSignedInCustomer = isRoleAuthenticated('customer')

  const resolvedNavItems = navItems === defaultNavItems && isSignedInCustomer
    ? signedInCustomerNavItems
    : navItems

  const resolvedShowSignIn = showSignIn && !isSignedInCustomer

  const handleLogout = () => {
    clearAuthSession()
    navigate(logoutTo)
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('recipehub-theme', theme)
  }, [theme])

  return (
    <header className="sticky top-0 z-30 border-b border-base-300/80 bg-base-100/95 backdrop-blur">
      <div className="navbar w-full px-4 sm:px-6 lg:px-8">
        <div className="navbar-start gap-2">
          <div className="dropdown">
            <button tabIndex={0} className="btn btn-ghost btn-circle lg:hidden" aria-label="open menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <ul tabIndex={0} className="menu dropdown-content z-[1] mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow">
              {resolvedNavItems.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end}>{item.label}</NavLink>
                </li>
              ))}
            </ul>
          </div>
          <Link to={brandTo} className="text-xl font-display tracking-wide">
            {brandLabel}
          </Link>
        </div>

        <nav className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">
            {resolvedNavItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => (isActive ? 'font-semibold text-primary' : 'font-medium')}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar-end gap-2">
          {userLabel ? <span className="hidden text-sm font-semibold opacity-80 md:inline">{userLabel}</span> : null}
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setTheme((prev) => (prev === 'cupcake' ? 'bumblebee' : 'cupcake'))}
          >
            {theme === 'cupcake' ? 'Warm Mode' : 'Fresh Mode'}
          </button>
          {isSignedInCustomer && !showLogout ? <Link className="btn btn-ghost btn-sm" to="/customer">My Home</Link> : null}
          {showLogout ? <button className="btn btn-ghost btn-sm" onClick={handleLogout} type="button">Logout</button> : null}
          {resolvedShowSignIn ? <Link className="btn btn-primary btn-sm" to={signInTo}>Sign in</Link> : null}
        </div>
      </div>
    </header>
  )
}
