import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(100),
})

export const registerSchema = z.object({
  name: z.string().min(3).max(200),
  email: z.string().email(),
  password: z.string().min(3).max(100),
})

export const updateUserSchema = z.object({
  name: z.string().min(3).max(200),
  email: z.string().email(),
  password: z.string().min(3).max(100),
})
