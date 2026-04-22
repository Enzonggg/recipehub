import { Outlet } from 'react-router-dom'
import { Footer } from '../common/Footer.jsx'
import { Navbar } from '../common/Navbar.jsx'

export function RolePanelLayout({ brand, welcome, navItems, panelClassName = '', panelSubtitle = '', logoutTo = '/login/customer' }) {
  return (
    <div className={`panel-shell ${panelClassName}`}>
      <Navbar
        navItems={navItems}
        brandLabel={brand}
        brandTo={navItems[0]?.to || '/'}
        showSignIn={false}
        showLogout={true}
        logoutTo={logoutTo}
        userLabel={welcome}
      />
      <main className="role-main-shell">
        <section className="role-shell animate-[fadeIn_.35s_ease]">
          <header className="role-head">
            <div>
              <h1 className="role-brand">{brand}</h1>
              {panelSubtitle ? <p className="role-subtitle">{panelSubtitle}</p> : null}
            </div>
          </header>

          <div className="role-content">
            <Outlet />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
