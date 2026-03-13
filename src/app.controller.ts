import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: 'Root / health' })
  @ApiResponse({ status: 200, description: 'Returns a welcome message.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
