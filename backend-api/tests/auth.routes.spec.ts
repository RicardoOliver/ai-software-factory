import request from 'supertest'

import { createApp } from '../src/app'

describe('Auth and Users Routes', () => {
  const app = createApp()

  it('deve validar payload inválido no registro', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      name: 'A',
      email: 'email-invalido',
      password: '123',
    })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('VALIDATION_ERROR')
  })

  it('deve registrar, autenticar e acessar /usuarios/me', async () => {
    const registerResponse = await request(app).post('/api/v1/auth/register').send({
      name: 'Maria',
      email: 'maria@example.com',
      password: 'Senha@123',
    })

    expect(registerResponse.status).toBe(201)

    const token = registerResponse.body.accessToken

    const meResponse = await request(app)
      .get('/api/v1/usuarios/me')
      .set('Authorization', `Bearer ${token}`)

    expect(meResponse.status).toBe(200)
    expect(meResponse.body.email).toBe('maria@example.com')
  })

  it('deve bloquear /usuarios/me sem token', async () => {
    const response = await request(app).get('/api/v1/usuarios/me')

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('UNAUTHORIZED')
  })

  it('deve permitir endpoint admin para usuário admin', async () => {
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@example.com',
      password: 'Admin@1234',
    })

    expect(loginResponse.status).toBe(200)

    const response = await request(app)
      .get('/api/v1/usuarios/admin/stats')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.totalUsers).toEqual(expect.any(Number))
  })
})
