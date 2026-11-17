import { motion } from 'motion/react'
import { AlertTriangle, Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Spotlight } from '@/components/aceternity/Spotlight'

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center gap-6 overflow-hidden px-4">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="hsl(var(--primary))" />
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
      >
        <AlertTriangle className="h-24 w-24 text-primary/60" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-7xl font-bold text-gradient"
      >
        404
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-muted-foreground"
      >
        Página no encontrada.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-md text-center text-sm text-muted-foreground"
      >
        La página que buscas no existe o fue movida. Intenta volver al inicio o buscar habitaciones.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3"
      >
        <Button asChild className="bg-cta-gradient text-white">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" /> Ir al inicio
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/rooms">
            <Search className="mr-2 h-4 w-4" /> Buscar habitaciones
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}