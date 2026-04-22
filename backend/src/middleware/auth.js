import { verifyAccessToken } from '../services/tokenService.js'

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Unauthorized: missing Bearer token.' })
  }

  try {
    const decoded = verifyAccessToken(token)
    req.user = decoded
    return next()
  } catch {
    return res.status(401).json({ message: 'Unauthorized: invalid or expired token.' })
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permission.' })
    }

    return next()
  }
}
