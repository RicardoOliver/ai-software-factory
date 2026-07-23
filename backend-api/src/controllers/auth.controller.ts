import { NextFunction, Request, Response } from 'express'

import { AuthService } from '../services/auth.service'

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(req.body)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}
