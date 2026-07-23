import { NextFunction, Request, Response } from 'express'
import { z, ZodError, ZodTypeAny } from 'zod'

import { AppError } from '../errors/app-error'

interface ValidationSchemas {
  body?: ZodTypeAny
  query?: ZodTypeAny
  params?: ZodTypeAny
}

const mapZodError = (error: ZodError): Array<{ field: string; message: string }> => {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'root',
    message: issue.message,
  }))
}

export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body)
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as Request['query']
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as Request['params']
      }

      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new AppError('VALIDATION_ERROR', 400, 'Dados inválidos', mapZodError(error)))
        return
      }
      next(error)
    }
  }
}
