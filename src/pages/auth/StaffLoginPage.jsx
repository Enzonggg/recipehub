import { RoleLoginCard } from '../../components/auth/RoleLoginCard.jsx'

export function StaffLoginPage() {
  return (
    <RoleLoginCard
      role="Staff"
      subtitle="Manage submissions and keep quality high with structured recipe workflows."
      image="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1400&q=80"
      loginPath="/staff"
      registerPath="/register/staff"
      panelTone="from-sky-700/75 to-cyan-500/65"
    />
  )
}
