import { RoleLoginCard } from '../../components/auth/RoleLoginCard.jsx'

export function CustomerLoginPage() {
  return (
    <RoleLoginCard
      role="Customer"
      subtitle="Cook, save, and engage with your favorite recipes in a clean home-cook experience."
      image="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1400&q=80"
      loginPath="/customer"
      registerPath="/register"
      panelTone="from-emerald-600/75 to-lime-500/65"
    />
  )
}
