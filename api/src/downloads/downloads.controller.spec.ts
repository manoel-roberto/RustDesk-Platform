import { Test, TestingModule } from '@nestjs/testing';
import { DownloadsController } from './downloads.controller';

describe('DownloadsController', () => {
  let controller: DownloadsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DownloadsController],
    }).compile();

    controller = module.get<DownloadsController>(DownloadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getClientInfo', () => {
    it('should return client metadata', () => {
      const result = controller.getClientInfo();
      expect(result.version).toBeDefined();
      expect(result.platform).toBe('Windows');
      expect(result.downloadUrl).toContain('.exe');
      expect(result.name).toBeDefined();
      expect(result.size).toBeDefined();
    });
  });

  describe('getBranding', () => {
    it('should return branding defaults when env vars are not set', () => {
      delete process.env.BRAND_COMPANY_NAME;
      delete process.env.BRAND_LOGO_URL;
      delete process.env.BRAND_PRIMARY_COLOR;

      const result = controller.getBranding();
      expect(result.companyName).toBe('RustDesk Enterprise');
      expect(result.logoUrl).toBeNull();
      expect(result.primaryColor).toBe('#10b981');
      expect(result.supportEmail).toBeDefined();
    });

    it('should use env vars when provided', () => {
      process.env.BRAND_COMPANY_NAME = 'ACME Corp';
      process.env.BRAND_PRIMARY_COLOR = '#ff0000';

      const result = controller.getBranding();
      expect(result.companyName).toBe('ACME Corp');
      expect(result.primaryColor).toBe('#ff0000');

      // Cleanup
      delete process.env.BRAND_COMPANY_NAME;
      delete process.env.BRAND_PRIMARY_COLOR;
    });
  });
});
