import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(3).max(200),
  email: z.string().email(),
  password: z.string().min(3).max(100),
})

export const updateUserSchema = z.object({
  name: z.string().min(3).max(200).optional(),
  email: z.string().email().optional(),
  password: z.string().min(3).max(100).optional(),
})
