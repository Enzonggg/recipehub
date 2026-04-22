import { Navigate } from 'react-router-dom'
import { getAuthRole, isAuthenticated } from '../../utils/authSession.js'

export function RoleProtectedRoute({ children, role, loginPath = '/login/customer' }) {
  if (!isAuthenticated()) {
    return <Navigate to={loginPath} replace />
  }

  if (getAuthRole() !== role) {
    return <Navigate to={loginPath} replace />
  }

  return children
}
