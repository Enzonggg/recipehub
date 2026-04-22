import { RolePanelLayout } from '../../components/panel/RolePanelLayout.jsx'
import { getAuthUser } from '../../utils/authSession.js'

const customerNavItems = [
  { label: 'Home', to: '/customer', end: true },
  { label: 'Go Premium', to: '/customer/premium' },
  { label: 'Favorites', to: '/customer/favorites' },
  { label: 'Contact Us', to: '/customer/contact' },
  { label: 'Account', to: '/customer/account' },
]

export function CustomerLayout() {
  const currentUser = getAuthUser()
  const displayName = currentUser?.fullName || 'Customer'

  return (
    <RolePanelLayout
      brand="RecipeHub"
      welcome={`Welcome ${displayName}!`}
      navItems={customerNavItems}
      panelClassName="customer-panel"
      panelSubtitle="Your Recipes and Account"
      logoutTo="/login/customer"
    />
  )
}
