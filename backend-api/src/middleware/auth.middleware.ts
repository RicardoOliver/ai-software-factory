import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { env } from '../config/env'
import { AppError } from '../errors/app-error'

interface JwtPayload {
  sub: string
  email: string
  role: 'admin' | 'user'
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError('UNAUTHORIZED', 401, 'Token não fornecido'))
    return
  }

  const token = authHeader.slice(7)

  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    }
    next()
  } catch {
    next(new AppError('INVALID_TOKEN', 401, 'Token inválido ou expirado'))
  }
}

export const authorize = (...roles: Array<'admin' | 'user'>) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('UNAUTHORIZED', 401, 'Usuário não autenticado'))
      return
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError('FORBIDDEN', 403, 'Permissão insuficiente'))
      return
    }

    next()
  }
}
