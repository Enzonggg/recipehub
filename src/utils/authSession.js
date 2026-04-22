const AUTH_TOKEN_KEY = 'recipehub-auth-token'
const AUTH_USER_KEY = 'recipehub-auth-user'

export function setAuthSession({ token, user }) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function getAuthUser() {
  const rawUser = localStorage.getItem(AUTH_USER_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser)
  } catch {
    return null
  }
}

export function getAuthRole() {
  return getAuthUser()?.role || null
}

export function setAuthUser(user) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function isAuthenticated() {
  return Boolean(getAuthToken() && getAuthRole())
}

export function isRoleAuthenticated(role) {
  return isAuthenticated() && getAuthRole() === role
}

export function isCustomerAuthenticated() {
  return isRoleAuthenticated('customer')
}

// Backward-compatible names used by older components.
export function clearAuthRole() {
  clearAuthSession()
}

export function setAuthRole(role) {
  setAuthSession({ token: '', user: { role } })
}
