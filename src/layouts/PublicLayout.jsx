import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '../components/common/Footer.jsx'
import { Navbar } from '../components/common/Navbar.jsx'

export function PublicLayout() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  return (
    <div className="min-h-screen bg-base-100">
      {isLandingPage ? null : <Navbar />}
      <main key={location.pathname} className="animate-[fadeIn_.35s_ease] pb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
