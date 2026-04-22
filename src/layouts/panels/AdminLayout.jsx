import { RolePanelLayout } from '../../components/panel/RolePanelLayout.jsx'
import { getAuthUser } from '../../utils/authSession.js'

const adminNavItems = [
  { label: 'Home', to: '/admin', end: true },
  { label: 'Staff Management', to: '/admin/staff' },
  { label: 'Users', to: '/admin/users' },
  { label: 'Approved', to: '/admin/approved' },
  { label: 'Pending', to: '/admin/pending' },
  { label: 'Rejected', to: '/admin/rejected' },
  { label: 'Inbox', to: '/admin/inbox' },
]

export function AdminLayout() {
  const currentUser = getAuthUser()
  const displayName = currentUser?.fullName || currentUser?.username || 'Admin'

  return (
    <RolePanelLayout
      brand="RecipeHub Admin Panel"
      welcome={`Welcome ${displayName}!`}
      navItems={adminNavItems}
      panelClassName="admin-panel"
      panelSubtitle="Moderation and Governance"
      logoutTo="/login/admin"
    />
  )
}
