import { UserRepository } from '../src/repositories/user.repository'
import { AuthService } from '../src/services/auth.service'

describe('AuthService', () => {
  it('deve registrar um usuário e retornar token', async () => {
    const repository = new UserRepository()
    const service = new AuthService(repository)

    const result = await service.register({
      name: 'Ricardo',
      email: 'ricardo@example.com',
      password: 'Senha@123',
    })

    expect(result.accessToken).toEqual(expect.any(String))
    expect(result.user.email).toBe('ricardo@example.com')
    expect(result.user.role).toBe('user')
  })

  it('deve impedir cadastro duplicado por e-mail', async () => {
    const repository = new UserRepository()
    const service = new AuthService(repository)

    await service.register({
      name: 'Ricardo',
      email: 'ricardo@example.com',
      password: 'Senha@123',
    })

    await expect(
      service.register({
        name: 'Outro',
        email: 'ricardo@example.com',
        password: 'Senha@123',
      }),
    ).rejects.toMatchObject({
      code: 'CONFLICT',
      statusCode: 409,
    })
  })

  it('deve autenticar usuário válido', async () => {
    const repository = new UserRepository()
    const service = new AuthService(repository)

    await service.register({
      name: 'Ricardo',
      email: 'ricardo@example.com',
      password: 'Senha@123',
    })

    const result = await service.login({
      email: 'ricardo@example.com',
      password: 'Senha@123',
    })

    expect(result.accessToken).toEqual(expect.any(String))
    expect(result.user.name).toBe('Ricardo')
  })

  it('deve falhar com senha inválida', async () => {
    const repository = new UserRepository()
    const service = new AuthService(repository)

    await service.register({
      name: 'Ricardo',
      email: 'ricardo@example.com',
      password: 'Senha@123',
    })

    await expect(
      service.login({
        email: 'ricardo@example.com',
        password: 'SenhaErrada@123',
      }),
    ).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      statusCode: 401,
    })
  })
})
