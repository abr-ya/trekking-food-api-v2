import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS) || 30_000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth to handle raw request body
  });

  // Prevent any request (including login) from hanging when DB is slow/unreachable
  app.use((_req: unknown, res: { setTimeout: (ms: number, fn: () => void) => void; headersSent: boolean; status: (code: number) => { json: (body: object) => void }; end?: () => void }, next: () => void) => {
    res.setTimeout(REQUEST_TIMEOUT_MS, () => {
      if (!res.headersSent) {
        res.status(504).json({
          error: 'Gateway Timeout',
          message: `Request did not complete within ${REQUEST_TIMEOUT_MS / 1000}s. Database may be unreachable.`,
        });
      }
    });
    next();
  });

  const { getCorsOptions } = await import('./cors');
  app.enableCors(getCorsOptions());

  const config = new DocumentBuilder()
    .setTitle('Trekking Food API')
    .setDescription('API documentation for Trekking Food – auth via Better Auth at `/api/auth/*`')
    .setVersion('1.0')
    .addTag('app', 'Health and root')
    .addTag('users', 'User profile and public routes')
    .addTag('test', 'DB connectivity and diagnostics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
}
bootstrap();
