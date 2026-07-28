const parsePort = (value: string | undefined, fallback: number): number => {
  const port = Number(value)
  return Number.isInteger(port) && port > 0 ? port : fallback
}

/**
 * Validates that critical environment variables are defined.
 * Fails fast in production to prevent silent security issues.
 */
const validateRequiredEnv = (key: string, value: string | undefined): string => {
  if (!value) {
    const isProduction = process.env.NODE_ENV === 'production'
    const message = `❌ CRITICAL: Environment variable ${key} is not defined`
    if (isProduction) {
      throw new Error(message)
    }
    console.warn(`⚠️  WARNING: ${message} (using fallback in development only)`)
  }
  return value || ''
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parsePort(process.env.PORT, 3000),
  jwtSecret: process.env.JWT_SECRET || (() => {
    throw new Error(
      '❌ CRITICAL: JWT_SECRET environment variable is not defined. ' +
      'This is required for token signing and cannot use a fallback value. ' +
      'Set JWT_SECRET in your .env file before running this application.'
    )
  })(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
}