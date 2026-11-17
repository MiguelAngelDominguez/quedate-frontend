'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { trustService } from '@/services/trust.service'

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, 'El comentario es requerido'),
})

interface RoomReviewFormProps {
  roomId: number
}

export function RoomReviewForm({ roomId }: RoomReviewFormProps) {
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: '' },
  })

  const [rating, setRating] = useState(5)

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    try {
      await trustService.createReview(roomId, {
        rating: values.rating,
        comment: values.comment,
      })
      toast.success('Reseña publicada correctamente')
      form.reset({ rating: 5, comment: '' })
      setRating(5)
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Error al publicar la reseña')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-400" />
          Dejar una reseña
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Calificación</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star)
                    form.setValue('rating', star)
                  }}
                  className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors ${
                    star <= rating
                      ? 'text-yellow-400 bg-yellow-500/10'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  <Star className="h-5 w-5" />
                </button>
              ))}
            </div>
            {form.formState.errors.rating && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.rating?.message}
              </p>
            )}
          </div>
          <div>
            <Label>Comentario</Label>
            <Textarea
              {...form.register('comment')}
              placeholder="Cuéntanos tu experiencia..."
              rows={3}
            />
            {form.formState.errors.comment && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.comment?.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full bg-cta-gradient text-white" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Publicando...' : 'Publicar reseña'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}