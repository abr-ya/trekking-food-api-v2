import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Session, UserSession, AllowAnonymous, OptionalAuth } from '@thallesp/nestjs-better-auth';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Get('me')
  @ApiOperation({ summary: 'Current user profile (protected)' })
  @ApiResponse({ status: 200, description: 'Returns the authenticated user.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProfile(@Session() session: UserSession) {
    return { user: session.user };
  }

  @Get('public')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Public route' })
  @ApiResponse({ status: 200, description: 'Public message, no auth required.' })
  getPublic() {
    return { message: 'Public route – no auth required' };
  }

  @Get('optional')
  @OptionalAuth()
  @ApiOperation({ summary: 'Optional auth' })
  @ApiResponse({ status: 200, description: 'Returns auth status; user present if logged in.' })
  getOptional(@Session() session: UserSession) {
    return { authenticated: !!session, user: session?.user ?? null };
  }
}
