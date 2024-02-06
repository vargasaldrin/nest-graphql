import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import * as session from 'express-session'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.use(
		session({
			secret: 'my-secret',
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 3600000,
				httpOnly: true,
				secure: false,
				sameSite: 'lax',
			},
		}),
	)
	app.useGlobalPipes(new ValidationPipe())
	await app.listen(3000)
}
bootstrap()
