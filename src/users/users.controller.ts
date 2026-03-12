import { Controller, Get } from '@nestjs/common';
import { Session, UserSession, AllowAnonymous, OptionalAuth } from '@thallesp/nestjs-better-auth';

@Controller('users')
export class UsersController {
  @Get('me')
  async getProfile(@Session() session: UserSession) {
    return { user: session.user };
  }

  @Get('public')
  @AllowAnonymous()
  getPublic() {
    return { message: 'Public route – no auth required' };
  }

  @Get('optional')
  @OptionalAuth()
  getOptional(@Session() session: UserSession) {
    return { authenticated: !!session, user: session?.user ?? null };
  }
}
