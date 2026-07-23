import { NextFunction, Request, Response } from 'express'

import { UserRepository } from '../repositories/user.repository'
import { AuthService } from '../services/auth.service'

export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}

  me = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = this.authService.me(req.user!.id)
      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  adminStats = (_req: Request, res: Response): void => {
    const users = this.userRepository.all()
    const adminCount = users.filter((user) => user.role === 'admin').length

    res.status(200).json({
      totalUsers: users.length,
      adminUsers: adminCount,
      regularUsers: users.length - adminCount,
    })
  }
}
