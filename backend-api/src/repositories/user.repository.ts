import { User, UserRole } from '../domain/user'

export interface CreateUserInput {
  name: string
  email: string
  passwordHash: string
  role: UserRole
}

export class UserRepository {
  private users: User[] = []
  private sequence = 1

  create(input: CreateUserInput): User {
    const user: User = {
      id: String(this.sequence++),
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role,
      createdAt: new Date(),
    }

    this.users.push(user)
    return user
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email.toLowerCase() === email.toLowerCase())
  }

  findById(id: string): User | undefined {
    return this.users.find((user) => user.id === id)
  }

  all(): User[] {
    return [...this.users]
  }
}
