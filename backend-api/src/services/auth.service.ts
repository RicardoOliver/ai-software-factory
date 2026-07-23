import bcrypt from 'bcryptjs'
import jwt, { Secret, SignOptions } from 'jsonwebtoken'

import { env } from '../config/env'
import { PublicUser, UserRole } from '../domain/user'
import { AppError } from '../errors/app-error'
import { UserRepository } from '../repositories/user.repository'

interface RegisterInput {
  name: string
  email: string
  password: string
  role?: UserRole
}

interface LoginInput {
  email: string
  password: string
}

interface AuthResult {
  accessToken: string
  tokenType: 'Bearer'
  expiresIn: string
  user: PublicUser
}

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(input: RegisterInput): Promise<AuthResult> {
    const existingUser = this.userRepository.findByEmail(input.email)

    if (existingUser) {
      throw new AppError('CONFLICT', 409, 'E-mail já cadastrado')
    }

    const passwordHash = await bcrypt.hash(input.password, 10)

    const user = this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role ?? 'user',
    })

    return {
      accessToken: this.signToken(user.id, user.email, user.role),
      tokenType: 'Bearer',
      expiresIn: env.jwtExpiresIn,
      user: this.toPublicUser(user),
    }
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = this.userRepository.findByEmail(input.email)

    if (!user) {
      throw new AppError('UNAUTHORIZED', 401, 'Credenciais inválidas')
    }

    const validPassword = await bcrypt.compare(input.password, user.passwordHash)
    if (!validPassword) {
      throw new AppError('UNAUTHORIZED', 401, 'Credenciais inválidas')
    }

    return {
      accessToken: this.signToken(user.id, user.email, user.role),
      tokenType: 'Bearer',
      expiresIn: env.jwtExpiresIn,
      user: this.toPublicUser(user),
    }
  }

  me(userId: string): PublicUser {
    const user = this.userRepository.findById(userId)
    if (!user) {
      throw new AppError('NOT_FOUND', 404, 'Usuário não encontrado')
    }
    return this.toPublicUser(user)
  }

  private signToken(sub: string, email: string, role: UserRole): string {
    const payload = { email, role }
    return jwt.sign(payload, env.jwtSecret as Secret, {
      subject: sub,
      expiresIn: env.jwtExpiresIn,
    } as SignOptions)
  }

  private toPublicUser(user: {
    id: string
    name: string
    email: string
    role: UserRole
    createdAt: Date
  }): PublicUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    }
  }
}
