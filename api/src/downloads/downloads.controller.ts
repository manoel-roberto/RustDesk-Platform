import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('downloads')
export class DownloadsController {
  @Get('client/info')
  @UseGuards(AuthGuard('jwt'))
  getClientInfo() {
    return {
      version: '1.2.0-custom',
      platform: 'Windows',
      downloadUrl: '/downloads/rustdesk-custom.exe',
      lastUpdated: new Date().toISOString(),
      size: '15.4 MB',
      name: 'RustDesk Enterprise Client'
    };
  }
}
