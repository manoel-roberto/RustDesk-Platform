import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DevicesService } from './devices.service';

@Controller()
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  // ============================================
  // API-DEV - Controle Gerencial de Dispositivos 
  // Base path: /devices
  // ============================================

  @UseGuards(AuthGuard('jwt'))
  @Get('devices')
  async findAllDevices(@Query() query: any) {
    return this.devicesService.findAll(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('devices/:id')
  async findOneDevice(@Param('id') id: string) {
    return this.devicesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('devices')
  async createDevice(@Body() createDto: any) {
    return this.devicesService.create(createDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('devices/:id')
  async updateDevice(@Param('id') id: string, @Body() updateDto: any) {
    return this.devicesService.update(id, updateDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('devices/:id')
  async removeDevice(@Param('id') id: string) {
    await this.devicesService.remove(id);
    return { message: 'Device deleted successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('devices/:id/connect')
  async connectDevice(@Param('id') id: string) {
    return this.devicesService.generateConnectLink(id);
  }

  // ============================================
  // Address Book Integration p/ Client RustDesk
  // ============================================

  @UseGuards(AuthGuard('jwt'))
  @Get('users/peers')
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
