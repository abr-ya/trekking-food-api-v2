import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Trekking Food API v2 – Better Auth + Prisma PostgreSQL';
  }
}
