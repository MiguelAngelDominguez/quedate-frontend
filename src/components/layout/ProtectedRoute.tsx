import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import type { RoleName } from '@/types/api'

export function ProtectedRoute({ roles }: { roles?: RoleName[] }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  if (roles && user && !roles.some((r) => user.roles.includes(r))) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}