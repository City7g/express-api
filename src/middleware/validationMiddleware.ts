import type { Request, Response, NextFunction } from 'express'
import { ZodError, z } from 'zod'

export const validateData = (schema: z.ZodSchema<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }))
        res.status(400).json({ message: 'Invalid data', errors: errorMessages })
      } else {
        res.status(500).json({ message: 'Internal Server Error' })
      }
    }
  }
}
