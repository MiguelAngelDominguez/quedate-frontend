import { motion } from 'motion/react'
import { Mail, Code } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo size={32} showWordmark />
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Conectamos estudiantes con arrendadores verificados cerca de su universidad. Tu hogar, a un paso del campus.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Plataforma para estudiantes que buscan alojamiento cerca de su universidad.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Navegación</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary">Inicio</Link></li>
              <li><Link to="/rooms" className="hover:text-primary">Buscar</Link></li>
              <li><Link to="/login" className="hover:text-primary">Iniciar sesión</Link></li>
              <li><Link to="/register" className="hover:text-primary">Registrarse</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Contacto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contacto@quedate.com</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Proyecto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Code className="h-4 w-4" /> GitHub</li>
            </ul>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground"
        >
          © {new Date().getFullYear()} Quédate · Proyecto académico CS2031 DBP · UTEC
        </motion.div>
      </div>
    </footer>
  )
}