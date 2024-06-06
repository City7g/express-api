import { Request } from 'express'

declare global {
  namespace Express {
    interface Request {
      filterOptions?: {
        limit: number | undefined
        page: number | undefined
      }
      data?: {
        [key: string]: string
      }
    }
  }
}
