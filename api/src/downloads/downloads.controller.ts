import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Downloads')
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

  @Get('branding')
  @UseGuards(AuthGuard('jwt'))
  getBranding() {
    return {
      companyName: process.env.BRAND_COMPANY_NAME || 'RustDesk Enterprise',
      logoUrl: process.env.BRAND_LOGO_URL || null,
      primaryColor: process.env.BRAND_PRIMARY_COLOR || '#10b981',
      supportEmail: process.env.BRAND_SUPPORT_EMAIL || 'suporte@empresa.com'
    };
  }
}
