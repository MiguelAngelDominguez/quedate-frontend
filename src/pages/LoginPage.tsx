import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, type LoginValues } from '@/schemas/auth'
import { Logo } from '@/components/common/Logo'
import { toast } from 'sonner'
import { Spotlight } from '@/components/aceternity/Spotlight'

export default function LoginPage() {
  const { login, loginPending, loginError } = useAuth()
  const navigate = useNavigate()
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } })

  const onSubmit = async (values: LoginValues) => {
    try {
      await login(values)
      toast.success('Sesión iniciada exitosamente')
      navigate('/')
    } catch {
      // error handled by hook
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-cta/5 px-4 py-12">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="hsl(var(--primary))" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size={48} showWordmark />
          <p className="mt-4 text-sm text-muted-foreground">
            Inicia sesión en Quédate
          </p>
        </div>

        <Card className="w-full overflow-hidden border-primary/20 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Iniciar sesión</CardTitle>
            <p className="text-sm text-muted-foreground">
              Bienvenido de vuelta
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              {loginError && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {loginError}
                </div>
              )}
              <Button type="submit" className="w-full bg-cta-gradient text-white" disabled={loginPending}>
                {loginPending ? 'Iniciando...' : 'Iniciar sesión'}
              </Button>
              <div className="flex items-center justify-between text-sm">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
                <a
                  href="/register"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Regístrate
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}