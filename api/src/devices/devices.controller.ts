import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DevicesService } from './devices.service';

@ApiTags('Dispositivos')
@ApiBearerAuth()
@Controller()
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  // ============================================
  // API-DEV - Controle Gerencial de Dispositivos 
  // Base path: /devices
  // ============================================

  @UseGuards(AuthGuard('jwt'))
  @Get('devices')
  @ApiOperation({ summary: 'Listar todos os dispositivos', description: 'Retorna a lista de dispositivos cadastrados com suporte a paginação e filtros.' })
  @ApiResponse({ status: 200, description: 'Lista de dispositivos retornada com sucesso.' })
  async findAllDevices(@Query() query: any) {
    return this.devicesService.findAll(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('devices/:id')
  @ApiOperation({ summary: 'Obter dispositivo por ID' })
  @ApiResponse({ status: 200, description: 'Dados do dispositivo encontrados.' })
  @ApiResponse({ status: 404, description: 'Dispositivo não encontrado.' })
  async findOneDevice(@Param('id') id: string) {
    return this.devicesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('devices')
  @ApiOperation({ summary: 'Criar novo dispositivo' })
  @ApiResponse({ status: 201, description: 'Dispositivo criado com sucesso.' })
  async createDevice(@Body() createDto: any) {
    return this.devicesService.create(createDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('devices/:id')
  @ApiOperation({ summary: 'Atualizar dispositivo' })
  async updateDevice(@Param('id') id: string, @Body() updateDto: any) {
    return this.devicesService.update(id, updateDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('devices/:id')
  @ApiOperation({ summary: 'Remover dispositivo', description: 'Realiza soft delete do dispositivo.' })
  async removeDevice(@Param('id') id: string) {
    await this.devicesService.remove(id);
    return { message: 'Device deleted successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('devices/:id/connect')
  @ApiOperation({ summary: 'Gerar link de conexão', description: 'Gera uma URL rustdesk:// para abrir o cliente desktop.' })
  async connectDevice(@Param('id') id: string) {
    return this.devicesService.generateConnectLink(id);
  }

  // ============================================
  // Address Book Integration p/ Client RustDesk
  // ============================================

  @UseGuards(AuthGuard('jwt'))
  @Get('users/peers')
  @ApiOperation({ summary: 'Listar Peers (Address Book)', description: 'Endpoint utilizado pelo cliente RustDesk para carregar a lista de contatos.' })
  async getPeers(@Request() req: any) {
    return this.devicesService.getRustdeskPeers(req.user);
  }

  @Post('users/seed')
  async seed() {
    return this.devicesService.seedDemoDevices();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('devices/export')
  async exportDevices() {
    return this.devicesService.exportToCsv();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('devices/import')
  async importDevices(@Body() body: { csv: string }) {
    await this.devicesService.importFromCsv(body.csv);
    return { message: 'Devices imported successfully' };
  }
}
