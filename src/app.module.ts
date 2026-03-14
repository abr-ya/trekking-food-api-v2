import { Module } from '@nestjs/common';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth';
import { setCorsHeaders } from './cors';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TestModule } from './test/test.module';
import { ProductsModule } from './products/products.module';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [
    PrismaModule,
    TestModule,
    AuthModule.forRoot({
      auth,
      middleware: (req, res, next) => {
        if (setCorsHeaders(req, res)) return;
        next();
      },
    }),
    UsersModule,
    ProductsModule,
    RecipesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
