import bcrypt from 'bcryptjs'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import pinoHttp from 'pino-http'
import swaggerUi from 'swagger-ui-express'

import { env } from './config/env'
import { AuthController } from './controllers/auth.controller'
import { UsersController } from './controllers/users.controller'
import { swaggerSpec } from './docs/swagger'
import { logger } from './infra/logger'
import { errorHandler } from './middleware/error-handler'
import { notFound } from './middleware/not-found.middleware'
import { UserRepository } from './repositories/user.repository'
import { createAuthRoutes } from './routes/auth.routes'
import { createUsersRoutes } from './routes/users.routes'
import { AuthService } from './services/auth.service'

export const createApp = () => {
  const app = express()

  const userRepository = new UserRepository()

  userRepository.create({
    name: 'Admin',
    email: 'admin@example.com',
    passwordHash: bcrypt.hashSync('Admin@1234', 10),
    role: 'admin',
  })

  const authService = new AuthService(userRepository)
  const authController = new AuthController(authService)
  const usersController = new UsersController(authService, userRepository)

  app.use(helmet())
  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    }),
  )

  if (env.nodeEnv !== 'test') {
    app.use(
      rateLimit({
        windowMs: 60 * 1000,
        limit: 60,
        standardHeaders: true,
        legacyHeaders: false,
      }),
    )
  }

  app.use(express.json({ limit: '1mb' }))

  app.use(
    pinoHttp({
      logger,
      serializers: {
        req: (req) => ({
          method: req.method,
          url: req.url,
          remoteAddress: req.remoteAddress,
        }),
        res: (res) => ({
          statusCode: res.statusCode,
        }),
      },
    }),
  )

  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
  })

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.use('/api/v1/auth', createAuthRoutes(authController))
  app.use('/api/v1/usuarios', createUsersRoutes(usersController))

  app.use(notFound)
  app.use(errorHandler)

  return app
}
