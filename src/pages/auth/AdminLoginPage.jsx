import { RoleLoginCard } from '../../components/auth/RoleLoginCard.jsx'

export function AdminLoginPage() {
  return (
    <RoleLoginCard
      role="Admin"
      subtitle="Oversee moderation, user governance, and platform-wide publishing controls."
      image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80"
      loginPath="/admin"
      panelTone="from-indigo-700/75 to-violet-600/65"
    />
  )
}
