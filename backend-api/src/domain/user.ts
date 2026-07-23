export type UserRole = 'admin' | 'user'

export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  role: UserRole
  createdAt: Date
}

export interface PublicUser {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}
