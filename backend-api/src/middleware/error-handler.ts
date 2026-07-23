import { NextFunction, Request, Response } from 'express'

import { AppError } from '../errors/app-error'
import { logger } from '../infra/logger'

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.code,
      message: error.message,
      details: error.details,
      timestamp: new Date().toISOString(),
      path: req.path,
    })
    return
  }

  logger.error({
    err: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    req: {
      method: req.method,
      path: req.path,
    },
  })

  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'Ocorreu um erro interno',
    timestamp: new Date().toISOString(),
    path: req.path,
  })
}
