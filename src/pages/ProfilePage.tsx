import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { User, FileText, ShieldCheck, Star, LogOut, Camera, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/hooks/useAuth'
import { userService } from '@/services/user.service'
import { verificationService } from '@/services/verification.service'
import { toast } from 'sonner'
import { Logo } from '@/components/common/Logo'
import { Spotlight } from '@/components/aceternity/Spotlight'
import { EmptyState } from '@/components/common/EmptyState'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    phone: user?.phone ?? '',
  })
  const [verificationType, setVerificationType] = useState('DNI')
  const [documentReference, setDocumentReference] = useState('')
  const [verificationPending, setVerificationPending] = useState(false)

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await userService.updateMe(formData)
      toast.success('Perfil actualizado')
      setEditMode(false)
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Error al actualizar')
    }
  }

  const submitVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!documentReference.trim()) {
      toast.error('Ingresa el número de documento')
      return
    }
    setVerificationPending(true)
    try {
      await verificationService.request({ type: verificationType, documentReference })
      toast.success('Solicitud de verificación enviada')
      setDocumentReference('')
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Error al solicitar verificación')
    } finally {
      setVerificationPending(false)
    }
  }

  const isLandlord = user?.roles?.includes('LANDLORD')

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="hsl(var(--primary))" />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Mi perfil</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-col items-center text-center"
        >
          <Logo size={40} showWordmark />
          <h1 className="mt-4 text-2xl font-bold text-foreground">Mi perfil</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona tu cuenta y solicitudes
          </p>
        </motion.div>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-primary-foreground shadow-md transition hover:bg-primary/90">
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl font-bold text-foreground">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {isLandlord ? 'Arrendador' : 'Estudiante'}
                    </span>
                    {isLandlord && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        Verificado
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? 'Cancelar' : 'Editar perfil'}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={logout} className="gap-1">
                    <LogOut className="h-4 w-4" />
                    Salir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Mis datos</span>
              </TabsTrigger>
              <TabsTrigger value="requests" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Solicitudes</span>
              </TabsTrigger>
              <TabsTrigger value="verification" className="gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Verificación</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Reseñas</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editMode ? (
                    <form onSubmit={saveProfile} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="firstName">Nombre</Label>
                          <Input
                            id="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Apellido</Label>
                          <Input
                            id="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button type="submit" className="bg-cta-gradient text-white">
                          Guardar cambios
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Nombre</p>
                        <p className="font-medium text-foreground">{user?.firstName} {user?.lastName}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Correo</p>
                        <p className="font-medium text-foreground">{user?.email}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Teléfono</p>
                        <p className="font-medium text-foreground">{user?.phone ?? 'No registrado'}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Rol</p>
                        <p className="font-medium text-foreground">
                          {user?.roles?.map((r: string) => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Mis solicitudes de alquiler</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={FileText}
                    title="Sin solicitudes"
                    description="Aún no has solicitado ninguna habitación."
                    actionLabel="Buscar habitaciones"
                    onAction={() => navigate('/rooms')}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verification" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Verificación de identidad</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLandlord ? (
                    <>
                      <p className="text-sm text-muted-foreground mb-6">
                        Como arrendador, puedes solicitar la verificación de tu identidad para generar más confianza con los estudiantes.
                      </p>
                      <form onSubmit={submitVerification} className="space-y-4">
                        <div>
                          <Label htmlFor="verificationType">Tipo de documento</Label>
                          <Select value={verificationType} onValueChange={setVerificationType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DNI">DNI</SelectItem>
                              <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                              <SelectItem value="OWNERSHIP">Propiedad</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="documentReference">Número de documento</Label>
                          <Input
                            id="documentReference"
                            type="text"
                            placeholder="87654321"
                            value={documentReference}
                            onChange={(e) => setDocumentReference(e.target.value)}
                          />
                        </div>
                        <Button type="submit" className="w-full bg-cta-gradient text-white" disabled={verificationPending}>
                          {verificationPending ? 'Enviando...' : 'Solicitar verificación'}
                        </Button>
                      </form>
                    </>
                  ) : (
                    <EmptyState
                      icon={ShieldCheck}
                      title="Verificación no disponible"
                      description="La verificación de arrendador está disponible solo para usuarios con rol de arrendador."
                      actionLabel="Cambiar a arrendador"
                      onAction={() => navigate('/register')}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Mis reseñas</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={Star}
                    title="Sin reseñas"
                    description="No has escrito reseñas aún."
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}