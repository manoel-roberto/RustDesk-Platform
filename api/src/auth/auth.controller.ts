import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('auth')
export class AuthController {
  
  @Get('me')
  getProfile(@Request() req: any) {
    // Retorna as informacoes parseadas pelo JwtStrategy
    return {
      id: req.user.userId,
      keycloak_id: req.user.userId, // No Keycloak o var de Subject (sub) já é o ID
      name: req.user.username,
      roles: req.user.roles,
      active: true
    };
  }
}
