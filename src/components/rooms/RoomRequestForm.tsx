'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Home } from 'lucide-react'
import { toast } from 'sonner'
import { MovingBorder } from '@/components/aceternity/MovingBorder'
import { trustService } from '@/services/trust.service'

const requestSchema = z.object({
  message: z.string().optional(),
  startDate: z.string().min(1, 'Fecha de inicio requerida'),
  endDate: z.string().min(1, 'Fecha de fin requerida'),
})

interface RoomRequestFormProps {
  roomId: number
}

export function RoomRequestForm({ roomId }: RoomRequestFormProps) {
  const form = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: { message: '', startDate: '', endDate: '' },
  })

  const onSubmit = async (values: z.infer<typeof requestSchema>) => {
    try {
      await trustService.createRentalRequest(roomId, {
        message: values.message,
        startDate: values.startDate,
        endDate: values.endDate,
      })
      toast.success('Solicitud enviada correctamente')
      form.reset()
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Error al enviar la solicitud')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Solicitar alquiler
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Mensaje (opcional)</Label>
            <Textarea
              {...form.register('message')}
              placeholder="Hola, me interesa esta habitación..."
              rows={3}
            />
            {form.formState.errors.message && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.message?.message}
              </p>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Fecha de inicio</Label>
              <Input
                type="date"
                {...form.register('startDate')}
              />
              {form.formState.errors.startDate && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.startDate?.message}
                </p>
              )}
            </div>
            <div>
              <Label>Fecha de fin</Label>
              <Input
                type="date"
                {...form.register('endDate')}
              />
              {form.formState.errors.endDate && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.endDate?.message}
                </p>
              )}
            </div>
          </div>
          <MovingBorder className="w-full" duration={3000}>
            <Button type="submit" className="w-full bg-cta-gradient text-white" disabled={form.formState.isSubmitting}>
              <Mail className="h-4 w-4 mr-2" />
              {form.formState.isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
            </Button>
          </MovingBorder>
        </form>
      </CardContent>
    </Card>
  )
}