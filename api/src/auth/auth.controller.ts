import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Autenticação')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('auth')
export class AuthController {
  
  @Get('me')
  @ApiOperation({ 
    summary: 'Verificar Token / Perfil', 
    description: 'Retorna as informações do usuário logado baseadas no token JWT emitido pelo Keycloak.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil retornado com sucesso.',
    schema: {
      example: {
        id: "uuid",
        keycloak_id: "uuid",
        name: "usuario",
        roles: ["admin", "technician"],
        active: true
      }
    }
  })
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
