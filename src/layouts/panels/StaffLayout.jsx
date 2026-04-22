import { RolePanelLayout } from '../../components/panel/RolePanelLayout.jsx'
import { getAuthUser } from '../../utils/authSession.js'

const staffNavItems = [
  { label: 'Home', to: '/staff', end: true },
  { label: 'Add Recipes', to: '/staff/add' },
  { label: 'Sales & Tax', to: '/staff/finance' },
  { label: 'Archive', to: '/staff/archive' },
  { label: 'Approved', to: '/staff/approved' },
  { label: 'Pending', to: '/staff/pending' },
  { label: 'Rejected', to: '/staff/rejected' },
]

export function StaffLayout() {
  const currentUser = getAuthUser()
  const displayName = currentUser?.fullName || 'Staff'

  return (
    <RolePanelLayout
      brand="RecipeHub"
      welcome={`Welcome ${displayName}!`}
      navItems={staffNavItems}
      panelClassName="staff-panel"
      panelSubtitle="Submission Workspace"
      logoutTo="/login/staff"
    />
  )
}
