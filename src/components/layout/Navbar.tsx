import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Menu, X, LogOut, User, Moon, Sun, Home, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { useAuth } from '@/hooks/useAuth'
import { Logo } from '@/components/common/Logo'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const dark = resolvedTheme === 'dark'

  const toggleDark = () => {
    setTheme(dark ? 'light' : 'dark')
  }

  const links = [
    { to: '/', label: 'Inicio', icon: Home },
    { to: '/rooms', label: 'Buscar', icon: Search },
  ]

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 mx-auto w-full border-b bg-background/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center">
          <Logo size={36} showWordmark />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const Icon = l.icon
            const active = location.pathname === l.to
            return (
              <Button
                key={l.to}
                variant="ghost"
                onClick={() => navigate(l.to)}
                className={`relative ${active ? 'text-primary' : ''}`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary"
                  />
                )}
              </Button>
            )
          })}

          {isAuthenticated && user?.roles?.includes('LANDLORD') && (
            <Button variant="ghost" onClick={() => navigate('/landlord/dashboard')} className={location.pathname.startsWith('/landlord') ? 'text-primary' : ''}>
              <Building2 className="mr-2 h-4 w-4" />
              Mi panel
            </Button>
          )}

          <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Tema">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {isAuthenticated ? (
            <>
              <Button variant="ghost" onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                {user?.firstName}
              </Button>
              <Button variant="outline" onClick={() => { logout(); navigate('/') }}>
                <LogOut className="mr-2 h-4 w-4" />
                Salir
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>Iniciar sesión</Button>
              <Button onClick={() => navigate('/register')}>Registrarse</Button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menú">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t bg-background/95 md:hidden"
          >
            <div className="flex flex-col gap-2 px-4 py-3">
              {links.map((l) => {
                const Icon = l.icon
                return (
                  <Button key={l.to} variant="ghost" className="justify-start" onClick={() => { navigate(l.to); setOpen(false) }}>
                    <Icon className="mr-2 h-4 w-4" />
                    {l.label}
                  </Button>
                )
              })}
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" className="justify-start" onClick={() => { navigate('/profile'); setOpen(false) }}>
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => { logout(); navigate('/'); setOpen(false) }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Salir
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="justify-start" onClick={() => { navigate('/login'); setOpen(false) }}>
                    Iniciar sesión
                  </Button>
                  <Button className="justify-start" onClick={() => { navigate('/register'); setOpen(false) }}>
                    Registrarse
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}