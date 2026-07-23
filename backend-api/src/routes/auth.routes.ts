import { Router } from 'express'
import { z } from 'zod'

import { AuthController } from '../controllers/auth.controller'
import { validate } from '../middleware/validate.middleware'

const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().toLowerCase(),
  password: z.string().min(8).max(128),
  role: z.enum(['admin', 'user']).optional(),
})

const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(8).max(128),
})

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       201:
 *         description: Usuário criado
 *       400:
 *         description: Input inválido
 *       409:
 *         description: E-mail já cadastrado
 */
/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Autentica usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */
export const createAuthRoutes = (authController: AuthController): Router => {
  const router = Router()

  router.post('/register', validate({ body: registerSchema }), authController.register)
  router.post('/login', validate({ body: loginSchema }), authController.login)

  return router
}
