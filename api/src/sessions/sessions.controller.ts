import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Sessões')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Estatísticas de sessões', description: 'Retorna métricas agregadas de conexões remotas.' })
  getStats(@Query() query: any) {
    return this.sessionsService.getSessionStats(query);
  }

  @Get()
  @ApiOperation({ summary: 'Listar histórico de sessões' })
  findAll(@Query() query: any) {
    return this.sessionsService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar início de sessão' })
  @ApiResponse({ status: 201, description: 'Sessão iniciada com sucesso.' })
  startSession(@Request() req: any, @Body() createSessionDto: any) {
    return this.sessionsService.startSession(req.user.userId, createSessionDto);
  }

  @Patch(':id/close')
  @ApiOperation({ summary: 'Encerrar sessão ativa' })
  closeSession(@Param('id') id: string, @Request() req: any, @Body() updateDto: any) {
    return this.sessionsService.closeSession(id, req.user.userId, updateDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados da sessão' })
  updateSession(@Param('id') id: string, @Body() updateDto: any) {
    return this.sessionsService.updateSession(id, updateDto);
  }
}
