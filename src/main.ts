import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth to handle raw request body
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

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
}
bootstrap();
