import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Search, MapPin, GraduationCap, Home as HomeIcon, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { catalogService } from '@/services/catalog.service'
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams'
import { Spotlight } from '@/components/aceternity/Spotlight'
import { TextGenerateEffect } from '@/components/aceternity/TextGenerateEffect'
import { BentoGrid, BentoGridItem } from '@/components/aceternity/BentoGrid'
import { BackersMarquee } from '@/components/layout/BackersMarquee'
import { cn } from '@/lib/utils'
import type { UniversityDTO } from '@/types/api'

export default function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [universities, setUniversities] = useState<UniversityDTO[]>([])
  const [stats, setStats] = useState({ universities: 0, rooms: 0 })

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      catalogService.universities({ signal: controller.signal }),
      catalogService.searchRooms({ page: 0, size: 1 }, { signal: controller.signal }),
    ])
      .then(([u, r]) => {
        if (controller.signal.aborted) return
        setUniversities(u)
        setStats({ universities: u.length, rooms: r.totalElements })
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('district', query)
    navigate(`/rooms?${params.toString()}`)
  }

  const statCards = [
    { label: 'Universidades', value: stats.universities || 10, icon: GraduationCap, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Habitaciones', value: stats.rooms || 100, icon: HomeIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Arrendadores verificados', value: 10, icon: ShieldCheck, color: 'text-orange-500', bg: 'bg-orange-50' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Spotlight className="top-0 left-0 md:left-60 md:top-[-10%]" fill="#0d9488" />
        <BackgroundBeams />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Plataforma verificada para estudiantes
            </div>
            <TextGenerateEffect
              words="Encuentra tu habitación cerca de tu universidad"
              className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl"
            />
            <p className="mt-4 text-lg text-muted-foreground">
              Conectamos estudiantes con arrendadores verificados. Busca, compara y solicita alojamiento de forma segura.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border bg-white/80 p-3 shadow-lg backdrop-blur-md sm:flex-row"
          >
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Distrito o universidad..."
                className="border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
              />
            </div>
            <Button type="submit" className="gap-2 bg-cta-gradient text-white shadow-md hover:opacity-90">
              <Search className="h-4 w-4" />
              Buscar
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 grid gap-4 sm:grid-cols-3"
          >
            {statCards.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="rounded-xl border bg-white/80 p-4 shadow-sm backdrop-blur transition-shadow hover:shadow-md"
                >
                  <div className={cn('mb-2 inline-flex rounded-lg p-2', s.bg)}>
                    <Icon className={cn('h-5 w-5', s.color)} />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{s.value}+</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      <BackersMarquee />

      {/* Bento Grid - Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground">¿Por qué Quédate?</h2>
          <p className="mt-2 text-muted-foreground">Todo lo que necesitas para encontrar tu hogar cerca del campus.</p>
        </motion.div>
        <BentoGrid>
          <BentoGridItem
            className="md:col-span-2"
            title="Búsqueda inteligente"
            description="Filtra por universidad, distrito, precio y distancia. Encuentra la habitación ideal en segundos."
            icon={<Search className="h-5 w-5 text-primary" />}
            header={
              <div className="flex h-24 items-end rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4">
                <span className="text-3xl font-bold text-primary">70+</span>
                <span className="ml-2 text-sm text-teal-700">habitaciones disponibles</span>
              </div>
            }
          />
          <BentoGridItem
            title="Arrendadores verificados"
            description="Sistema de verificación de identidad y propiedad. Confianza garantizada."
            icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />}
            header={
              <div className="flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50">
                <ShieldCheck className="h-12 w-12 text-emerald-600" />
              </div>
            }
          />
          <BentoGridItem
            title="Solicitudes y visitas"
            description="Envía solicitudes, agenda visitas y gestiona todo desde tu perfil."
            icon={<HomeIcon className="h-5 w-5 text-orange-500" />}
            header={
              <div className="flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-orange-50 to-amber-50">
                <HomeIcon className="h-12 w-12 text-orange-500" />
              </div>
            }
          />
          <BentoGridItem
            className="md:col-span-2"
            title="Reseñas y calificaciones"
            description="Consulta la reputación de arrendadores y habitaciones. Toma decisiones informadas."
            icon={<Sparkles className="h-5 w-5 text-primary" />}
            header={
              <div className="flex h-24 items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Sparkles className="h-6 w-6 text-amber-400" />
                  </motion.div>
                ))}
              </div>
            }
          />
        </BentoGrid>
      </section>

      {/* Universidades */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Universidades disponibles</h2>
          <p className="mt-2 text-muted-foreground">Busca habitaciones cerca de tu campus.</p>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {universities.map((u, i) => (
            <motion.button
              key={u.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => navigate(`/rooms?universityId=${u.id}`)}
              className="group rounded-xl border bg-card p-5 text-left shadow-sm transition hover:border-primary/30 hover:shadow-lg"
            >
              <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 transition group-hover:bg-primary/20">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{u.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{u.campusName ?? u.address}</p>
            </motion.button>
          ))}
          {universities.length === 0 && (
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 p-10 text-center text-white shadow-xl"
        >
          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight">¿Listo para encontrar tu hogar?</h2>
            <p className="mt-2 text-teal-100">Únete a cientos de estudiantes que ya encontraron su habitación ideal.</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="bg-white text-primary shadow-md hover:bg-primary/10"
                onClick={() => navigate('/register')}
              >
                Crear cuenta gratis
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10"
                onClick={() => navigate('/rooms')}
              >
                Explorar habitaciones
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}