import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { registerSchema, type RegisterValues } from '@/schemas/auth'
import { Logo } from '@/components/common/Logo'
import { toast } from 'sonner'
import { Spotlight } from '@/components/aceternity/Spotlight'

export default function RegisterPage() {
  const { register: registerUser, registerPending, registerError } = useAuth()
  const navigate = useNavigate()
  const form = useForm<RegisterValues>({ resolver: zodResolver(registerSchema), defaultValues: { role: 'USER' } })

  const onSubmit = async (values: RegisterValues) => {
    try {
      await registerUser({ ...values, phone: values.phone || undefined })
      toast.success('Cuenta creada exitosamente')
      navigate('/')
    } catch {
      // error handled by hook
    }
  }

  return (
    <div className="relative flex min-h-screen bg-background">
      <Spotlight className="-top-40 right-0 md:-top-20 md:right-60" fill="hsl(var(--accent))" />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-md w-full"
        >
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <Logo size={48} showWordmark />
            <p className="mt-4 text-sm text-muted-foreground">
              Crea tu cuenta en Quédate
            </p>
          </div>

          <Card className="w-full overflow-hidden border-primary/20 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Crear cuenta</CardTitle>
              <p className="text-sm text-muted-foreground">
                Únete a miles de estudiantes
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Juan"
                      {...form.register('firstName')}
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Pérez"
                      {...form.register('lastName')}
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    {...form.register('email')}
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...form.register('password')}
                  />
                  {form.formState.errors.password && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="999 123 456"
                    {...form.register('phone')}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Tipo de usuario</Label>
                  <Select
                    value={form.watch('role')}
                    onValueChange={(v) => form.setValue('role', v as 'USER' | 'LANDLORD')}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">Estudiante</SelectItem>
                      <SelectItem value="LANDLORD">Arrendador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {registerError && (
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {registerError}
                  </div>
                )}
                <Button type="submit" className="w-full bg-cta-gradient text-white" disabled={registerPending}>
                  {registerPending ? 'Creando...' : 'Crear cuenta'}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  ¿Ya tienes cuenta?{' '}
                  <a
                    href="/login"
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Inicia sesión
                  </a>
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}