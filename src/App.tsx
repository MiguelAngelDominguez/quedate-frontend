import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Toaster } from '@/components/ui/sonner'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/auth.service'

const HomePage = lazy(() => import('@/pages/HomePage'))
const SearchPage = lazy(() => import('@/pages/SearchPage'))
const RoomDetailPage = lazy(() => import('@/pages/RoomDetailPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const LandlordDashboardPage = lazy(() => import('@/pages/LandlordDashboardPage'))
const LandlordRoomsPage = lazy(() => import('@/pages/LandlordRoomsPage'))
const RoomFormPage = lazy(() => import('@/pages/RoomFormPage'))
const MyRequestsPage = lazy(() => import('@/pages/MyRequestsPage'))
const LandlordRequestsPage = lazy(() => import('@/pages/LandlordRequestsPage'))
const VisitsPage = lazy(() => import('@/pages/VisitsPage'))
const AdminVerificationsPage = lazy(() => import('@/pages/AdminVerificationsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function PageFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 w-full animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<SearchPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-requests" element={<MyRequestsPage />} />
            <Route path="/visits/:requestId" element={<VisitsPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['LANDLORD']} />}>
            <Route path="/landlord/dashboard" element={<LandlordDashboardPage />} />
            <Route path="/landlord/rooms" element={<LandlordRoomsPage />} />
            <Route path="/landlord/rooms/new" element={<RoomFormPage />} />
            <Route path="/landlord/rooms/:id/edit" element={<RoomFormPage />} />
            <Route path="/landlord/requests" element={<LandlordRequestsPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/admin/verifications" element={<AdminVerificationsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  useEffect(() => {
    useAuthStore.getState().hydrate()
    const refreshToken = useAuthStore.getState().refreshToken
    if (refreshToken) {
      authService
        .refresh(refreshToken)
        .then((res) => {
          useAuthStore.getState().setAuth(res.userInfo, res.accessToken, res.refreshToken)
        })
        .catch(() => {
          useAuthStore.getState().logout()
        })
    }
  }, [])

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Navbar />
        <Suspense fallback={<PageFallback />}>
          <AnimatedRoutes />
        </Suspense>
        <Footer />
        <Toaster />
      </ErrorBoundary>
    </BrowserRouter>
  )
}