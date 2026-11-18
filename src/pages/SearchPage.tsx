import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Search, MapPin, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'motion/react'
import { catalogService } from '@/services/catalog.service'
import { RoomCard } from '@/components/rooms/RoomCard'
import { RoomMap } from '@/components/rooms/RoomMap'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'
import { Pagination } from '@/components/ui/pagination'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import type { Page, RoomSummaryDTO, UniversityDTO } from '@/types/api'

const ROOM_TYPES = ['Entire Place', 'Private Room', 'Shared Room']

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Filters state
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')
  const [district, setDistrict] = useState(searchParams.get('district') ?? '')
  const [universityId, setUniversityId] = useState(searchParams.get('universityId') ?? '')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') ?? 'price')
  const [page, setPage] = useState(Number(searchParams.get('page') ?? 0))
  const [size, setSize] = useState(Number(searchParams.get('size') ?? 10))
  const [roomTypes, setRoomTypes] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Universities for select
  const [universities, setUniversities] = useState<UniversityDTO[]>([])

  // Data
  const [data, setData] = useState<Page<RoomSummaryDTO> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedDistrict = useDebounce(district, 400)
  const queryString = useMemo(() => searchParams.toString(), [searchParams])

  // Load universities once
  useEffect(() => {
    const controller = new AbortController()
    catalogService
      .universities({ signal: controller.signal })
      .then(setUniversities)
      .catch(() => {})
    return () => controller.abort()
  }, [])

  // Fetch rooms
  const load = async (signal?: AbortSignal) => {
    setLoading(true)
    setError(null)
    try {
      const res = await catalogService.searchRooms(
        {
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          district: debouncedDistrict || undefined,
          universityId: universityId || undefined,
          page,
          size,
          sortBy,
        },
        { signal },
      )
      if (!signal?.aborted) setData(res)
    } catch (e) {
      if (!signal?.aborted) setError((e as Error).message)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString, debouncedDistrict])

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (district) params.set('district', district)
    if (universityId) params.set('universityId', universityId)
    if (sortBy) params.set('sortBy', sortBy)
    params.set('page', '0')
    params.set('size', String(size))
    setSearchParams(params)
    setPage(0)
  }

  const toggleRoomType = (type: string) => {
    setRoomTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
  }

  // Pagination helpers
  const from = data ? data.number * data.size + 1 : 0
  const to = data ? Math.min((data.number + 1) * data.size, data.totalElements) : 0

  const goToPage = (p: number) => {
    setPage(p)
    const params = new URLSearchParams(searchParams)
    params.set('page', String(p))
    setSearchParams(params)
  }

  const changeSize = (s: number) => {
    setSize(s)
    setPage(0)
    const params = new URLSearchParams(searchParams)
    params.set('size', String(s))
    params.set('page', '0')
    setSearchParams(params)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Habitaciones</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-6 flex items-center gap-2">
        <SlidersHorizontal className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold">Habitaciones disponibles</h1>
      </div>

      {/* Collapsible Filters + Results + Map */}
      <div className="relative grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Center: Cards */}
        <main className="space-y-6">
          {/* Filters Button (mobile/desktop collapsed view) */}
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full lg:w-auto"
              onClick={() => setFiltersOpen((o) => !o)}
            >
              {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              Filtros
            </Button>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={() => load()}>
                <RefreshCw className="mr-2 h-4 w-4" /> Reintentar
              </Button>
            </div>
          )}

          {!loading && data && (
            <>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Mostrando <span className="font-medium text-foreground">{from}</span>–
                  <span className="font-medium text-foreground">{to}</span> de{' '}
                  <span className="font-medium text-foreground">{data.totalElements}</span> resultados
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Por página:</span>
                  <Select value={String(size)} onValueChange={(v) => changeSize(Number(v))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 25, 50, 100].map((s) => (
                        <SelectItem key={s} value={String(s)}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {data.content.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                  No se encontraron habitaciones. Intenta otros filtros.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.content.map((room, i) => (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <RoomCard room={room} />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {data.totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={data.totalPages}
                  onPageChange={goToPage}
                />
              )}
            </>
          )}
        </main>

        {/* Right: Map */}
        {!loading && data && data.content.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Ubicación</h2>
            </div>
            <RoomMap rooms={data.content} universities={universities} />
          </div>
        )}

        {/* Left Sidebar: Filters (hidden by default, slides in from left) */}
        <div
          className={cn(
            "absolute z-50 top-[60px] left-0 w-[340px] bg-card border-r shadow-lg",
            filtersOpen
              ? "translate-x-0 opacity-100 pointer-events-auto"
              : "-translate-x-full opacity-0 pointer-events-none",
            "transition-all duration-300 ease-in-out"
          )}
        >
          <div className="h-full flex flex-col p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filtros</h2>
              <Button variant="ghost" size="sm" onClick={() => setFiltersOpen(false)}>
                Cerrar
              </Button>
            </div>

            <form onSubmit={applyFilters} className="space-y-5 overflow-y-auto h-[calc(100vh-140px)]">
              {/* District */}
              <div className="space-y-2">
                <Label htmlFor="district">Distrito</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="district"
                    placeholder="Ej. Barranco, Miraflores..."
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Price range */}
              <div className="space-y-2">
                <Label>Precio (S/ por mes)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Mín"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <Input
                    placeholder="Máx"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* University */}
              <div className="space-y-2">
                <Label>Universidad</Label>
                <Select value={universityId} onValueChange={setUniversityId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    {universities.map((u) => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Room types */}
              <div className="space-y-2">
                <Label>Tipo de habitación</Label>
                <div className="space-y-2">
                  {ROOM_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={roomTypes.includes(type)}
                        onCheckedChange={() => toggleRoomType(type)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <Label>Ordenar por</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Precio (menor a mayor)</SelectItem>
                    <SelectItem value="distance">Distancia (más cercano)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full gap-2 mt-2">
                <Search className="h-4 w-4" />
                Aplicar filtros
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}