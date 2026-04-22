import { createBrowserRouter } from 'react-router-dom'
import { CustomerOnlyRoute } from '../components/auth/CustomerOnlyRoute.jsx'
import { RoleProtectedRoute } from '../components/auth/RoleProtectedRoute.jsx'
import { PublicLayout } from '../layouts/PublicLayout.jsx'
import { AdminLayout } from '../layouts/panels/AdminLayout.jsx'
import { CustomerLayout } from '../layouts/panels/CustomerLayout.jsx'
import { StaffLayout } from '../layouts/panels/StaffLayout.jsx'
import { AdminCreateStaffPage } from '../pages/admin/AdminCreateStaffPage.jsx'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage.jsx'
import { AdminInboxPage } from '../pages/admin/AdminInboxPage.jsx'
import { AdminRecipeStatusPage } from '../pages/admin/AdminRecipeStatusPage.jsx'
import { AdminUsersPage } from '../pages/admin/AdminUsersPage.jsx'
import { CommunityPage } from '../pages/CommunityPage.jsx'
import { CookProfilePage } from '../pages/CookProfilePage.jsx'
import { DashboardPage } from '../pages/DashboardPage.jsx'
import { HomePage } from '../pages/HomePage.jsx'
import { NotFoundPage } from '../pages/NotFoundPage.jsx'
import { PremiumPage } from '../pages/PremiumPage.jsx'
import { RegisterPage } from '../pages/RegisterPage.jsx'
import { AdminLoginPage } from '../pages/auth/AdminLoginPage.jsx'
import { CustomerLoginPage } from '../pages/auth/CustomerLoginPage.jsx'
import { StaffLoginPage } from '../pages/auth/StaffLoginPage.jsx'
import { StaffRegisterPage } from '../pages/auth/StaffRegisterPage.jsx'
import { CustomerAccountPage } from '../pages/customer/CustomerAccountPage.jsx'
import { CustomerContactPage } from '../pages/customer/CustomerContactPage.jsx'
import { CustomerFavoritesPage } from '../pages/customer/CustomerFavoritesPage.jsx'
import { CustomerHomePage } from '../pages/customer/CustomerHomePage.jsx'
import { CustomerPremiumPage } from '../pages/customer/CustomerPremiumPage.jsx'
import { CustomerRecipeDetailPage } from '../pages/customer/CustomerRecipeDetailPage.jsx'
import { StaffAddRecipePage } from '../pages/staff/StaffAddRecipePage.jsx'
import { StaffArchivePage } from '../pages/staff/StaffArchivePage.jsx'
import { StaffFinancePage } from '../pages/staff/StaffFinancePage.jsx'
import { StaffHomePage } from '../pages/staff/StaffHomePage.jsx'
import { StaffRecipeStatusPage } from '../pages/staff/StaffRecipeStatusPage.jsx'

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'premium',
        element: (
          <CustomerOnlyRoute nextPath="/premium">
            <PremiumPage />
          </CustomerOnlyRoute>
        ),
      },
      { path: 'community', element: <CommunityPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'cooks/:cookId', element: <CookProfilePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/login',
    element: <CustomerLoginPage />,
  },
  {
    path: '/login/customer',
    element: <CustomerLoginPage />,
  },
  {
    path: '/login/staff',
    element: <StaffLoginPage />,
  },
  {
    path: '/login/admin',
    element: <AdminLoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/register/staff',
    element: <StaffRegisterPage />,
  },
  {
    path: '/customer',
    element: (
      <RoleProtectedRoute role="customer" loginPath="/login/customer">
        <CustomerLayout />
      </RoleProtectedRoute>
    ),
    children: [
      { index: true, element: <CustomerHomePage /> },
      { path: 'premium', element: <CustomerPremiumPage /> },
      { path: 'favorites', element: <CustomerFavoritesPage /> },
      { path: 'contact', element: <CustomerContactPage /> },
      { path: 'account', element: <CustomerAccountPage /> },
      { path: 'recipe/:recipeId', element: <CustomerRecipeDetailPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <RoleProtectedRoute role="admin" loginPath="/login/admin">
        <AdminLayout />
      </RoleProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'staff', element: <AdminCreateStaffPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'approved', element: <AdminRecipeStatusPage status="approved" title="Approved Recipes" /> },
      { path: 'pending', element: <AdminRecipeStatusPage status="pending" title="Pending Recipes" /> },
      { path: 'rejected', element: <AdminRecipeStatusPage status="rejected" title="Rejected Recipes" /> },
      { path: 'inbox', element: <AdminInboxPage /> },
    ],
  },
  {
    path: '/staff',
    element: (
      <RoleProtectedRoute role="staff" loginPath="/login/staff">
        <StaffLayout />
      </RoleProtectedRoute>
    ),
    children: [
      { index: true, element: <StaffHomePage /> },
      { path: 'add', element: <StaffAddRecipePage /> },
      { path: 'finance', element: <StaffFinancePage /> },
      { path: 'archive', element: <StaffArchivePage /> },
      { path: 'approved', element: <StaffRecipeStatusPage status="approved" title="Approved Recipes" /> },
      { path: 'pending', element: <StaffRecipeStatusPage status="pending" title="Pending Recipes" /> },
      { path: 'rejected', element: <StaffRecipeStatusPage status="rejected" title="Rejected Recipes" /> },
    ],
  },
])
