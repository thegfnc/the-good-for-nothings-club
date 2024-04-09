import { z } from 'zod'

export const contactUsSchema = z.object({
  name: z.string().max(256),
  email: z.string().email(),
  phone: z.string().max(256).optional(),
  website: z.string().url().optional(),
  subject: z.string().max(256),
  message: z.string().max(5000),
})

export const newsletterSignUpSchema = z.object({
  email: z.string().email(),
})
