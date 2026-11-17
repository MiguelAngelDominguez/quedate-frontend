import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { Home, Save, Image as ImageIcon, MapPin, GraduationCap, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { catalogService } from '@/services/catalog.service'
import { roomService } from '@/services/room.service'
import { getErrorMessage } from '@/services/api'
import { roomSchema, type RoomValues } from '@/schemas/room'
import { toast } from 'sonner'
import type { LocationDTO, UniversityDTO } from '@/types/api'

export default function RoomFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const form = useForm<RoomValues>({ resolver: zodResolver(roomSchema) as any })

  const [locations, setLocations] = useState<LocationDTO[]>([])
  const [universities, setUniversities] = useState<UniversityDTO[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      catalogService.locations(undefined, { signal: controller.signal }),
      catalogService.universities({ signal: controller.signal }),
    ])
      .then(([locs, unis]) => {
        if (controller.signal.aborted) return
        setLocations(locs)
        setUniversities(unis)
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setLoadingData(false)
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (isEdit && id) {
      catalogService.room(Number(id)).then((r) => {
        form.reset({
          title: r.title,
          description: r.description ?? '',
          price: r.price,
          capacity: r.capacity,
          sizeM2: r.sizeM2,
          images: r.images?.join(', '),
        })
        if (r.images) setImageUrls(r.images)
      })
    }
  }, [id, isEdit, form])

  const onSubmit = async (values: RoomValues) => {
    const payload = {
      title: values.title,
      description: values.description,
      price: values.price,
      capacity: values.capacity,
      sizeM2: values.sizeM2,
      images: values.images ? values.images.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      locationId: values.locationId,
      universityId: values.universityId,
    }
    try {
      if (isEdit && id) {
        await roomService.update(Number(id), payload)
        toast.success('Habitación actualizada')
      } else {
        await roomService.create(payload)
        toast.success('Habitación creada')
      }
      navigate('/landlord/rooms')
    } catch (e) {
      toast.error(getErrorMessage(e))
    }
  }

  const handleImagesChange = (value: string) => {
    form.setValue('images', value)
    const urls = value.split(',').map((s) => s.trim()).filter(Boolean)
    setImageUrls(urls)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/landlord/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/landlord/rooms">Habitaciones</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{isEdit ? 'Editar' : 'Nueva'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/landlord/rooms')} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>
        <div className="flex items-center gap-3">
          <Home className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{isEdit ? 'Editar habitación' : 'Nueva habitación'}</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Editar habitación' : 'Nueva habitación'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Información básica</h3>
              <div>
                <Label className="flex items-center gap-2">
                  <Home className="h-4 w-4" /> Título
                </Label>
                <Input {...form.register('title')} placeholder="Ej: Departamento compartido cerca de UTEC" />
                {form.formState.errors.title && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.title.message}</p>
                )}
              </div>
              <div>
                <Label>Descripción</Label>
                <Textarea {...form.register('description')} placeholder="Describe la habitación..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Precio (S/ por mes)</Label>
                  <Input type="number" {...form.register('price')} placeholder="650" />
                  {form.formState.errors.price && (
                    <p className="text-xs text-destructive mt-1">{form.formState.errors.price.message}</p>
                  )}
                </div>
                <div>
                  <Label>Capacidad (personas)</Label>
                  <Input type="number" {...form.register('capacity')} placeholder="2" />
                </div>
              </div>
              <div>
                <Label>Tamaño (m²)</Label>
                <Input type="number" step="0.1" {...form.register('sizeM2')} placeholder="20" />
              </div>
            </div>

            {/* Location & University */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Ubicación</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Distrito
                  </Label>
                  <Select
                    value={form.watch('locationId')?.toString() ?? ''}
                    onValueChange={(v) => form.setValue('locationId', Number(v))}
                    disabled={loadingData}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id.toString()}>
                          {loc.district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" /> Universidad
                  </Label>
                  <Select
                    value={form.watch('universityId')?.toString() ?? ''}
                    onValueChange={(v) => form.setValue('universityId', Number(v))}
                    disabled={loadingData}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar universidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map((uni) => (
                        <SelectItem key={uni.id} value={uni.id.toString()}>
                          {uni.name} {uni.campusName ? `(${uni.campusName})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Imágenes</h3>
              <div>
                <Label className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> URLs de imágenes (separadas por coma)
                </Label>
                <Input
                  {...form.register('images')}
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                  onChange={(e) => handleImagesChange(e.target.value)}
                />
              </div>
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative aspect-video overflow-hidden rounded-lg border">
                      <img
                        src={url}
                        alt={`Preview ${i + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="gap-2 bg-cta-gradient text-white">
                <Save className="h-4 w-4" /> {isEdit ? 'Guardar cambios' : 'Crear habitación'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/landlord/rooms')}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}