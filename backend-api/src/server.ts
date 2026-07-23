import { createApp } from './app'
import { env } from './config/env'
import { logger } from './infra/logger'

const app = createApp()

app.listen(env.port, () => {
  logger.info({ port: env.port }, 'API em execução')
})
