import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Sessões')
@UseGuards(AuthGuard('jwt'))
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('stats')
  getStats(@Query() query: any) {
    return this.sessionsService.getSessionStats(query);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.sessionsService.findAll(query);
  }

  @Post()
  startSession(@Request() req: any, @Body() createSessionDto: any) {
    return this.sessionsService.startSession(req.user.userId, createSessionDto);
  }

  @Patch(':id/close')
  closeSession(@Param('id') id: string, @Request() req: any, @Body() updateDto: any) {
    return this.sessionsService.closeSession(id, req.user.userId, updateDto);
  }

  @Patch(':id')
  updateSession(@Param('id') id: string, @Body() updateDto: any) {
    return this.sessionsService.updateSession(id, updateDto);
  }
}
