import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const confiService: ConfigService<Env, true> = app.get(ConfigService)
  const port = confiService.get('PORT', { infer: true })

  await app.listen(port)
}
bootstrap()
