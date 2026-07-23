import { Request, Response } from 'express'

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: 'Rota não encontrada',
    timestamp: new Date().toISOString(),
    path: req.path,
  })
}
