import { z } from 'zod'

export const roomSchema = z.object({
  title: z.string().min(1, 'Título obligatorio').max(100),
  description: z.string().optional(),
  price: z.coerce.number().min(1, 'Precio inválido'),
  capacity: z.coerce.number().min(1).optional(),
  sizeM2: z.coerce.number().min(0).optional(),
  images: z.string().optional(),
  locationId: z.coerce.number().optional(),
  universityId: z.coerce.number().optional(),
})

export type RoomValues = z.infer<typeof roomSchema>