import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

export const registerSchema = z.object({
  firstName: z.string().min(1, 'Nombre obligatorio').max(100),
  lastName: z.string().min(1, 'Apellido obligatorio').max(100),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  phone: z.string().max(20).optional().or(z.literal('')),
  role: z.enum(['USER', 'LANDLORD']),
})

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>