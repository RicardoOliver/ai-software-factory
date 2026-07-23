import { Router } from 'express'

import { UsersController } from '../controllers/users.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'

/**
 * @openapi
 * /api/v1/usuarios/me:
 *   get:
 *     summary: Retorna dados do usuário autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
 *       401:
 *         description: Não autenticado
 */
/**
 * @openapi
 * /api/v1/usuarios/admin/stats:
 *   get:
 *     summary: Retorna estatísticas de usuários (apenas admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas retornadas
 *       403:
 *         description: Sem permissão
 */
export const createUsersRoutes = (usersController: UsersController): Router => {
  const router = Router()

  router.get('/me', authenticate, usersController.me)
  router.get('/admin/stats', authenticate, authorize('admin'), usersController.adminStats)

  return router
}
