import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { getDataSourceToken } from '@nestjs/typeorm';

const mockDataSource = {
  query: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
};

// Mock global fetch
global.fetch = jest.fn();

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: getDataSourceToken(),
          useValue: mockDataSource,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return ok when all services are healthy', async () => {
      mockDataSource.query.mockResolvedValue([]);
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
      process.env.RELAY_HOST = 'relay.example.com';

      const result = await controller.getHealth();

      expect(result.status).toBe('ok');
      expect(result.services.database).toBe('ok');
      expect(result.services.keycloak).toBe('ok');
      expect(result.services.relay).toBe('ok');
      expect(result.timestamp).toBeDefined();
    });

    it('should return degraded when database is down', async () => {
      mockDataSource.query.mockRejectedValue(new Error('Connection refused'));
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
      process.env.RELAY_HOST = 'relay.example.com';

      const result = await controller.getHealth();

      expect(result.status).toBe('degraded');
      expect(result.services.database).toBe('error');
    });

    it('should return degraded when keycloak is unreachable', async () => {
      mockDataSource.query.mockResolvedValue([]);
      (global.fetch as jest.Mock).mockRejectedValue(new Error('ECONNREFUSED'));
      process.env.RELAY_HOST = 'relay.example.com';

      const result = await controller.getHealth();

      expect(result.status).toBe('degraded');
      expect(result.services.keycloak).toBe('error');
    });

    it('should return degraded when relay is not configured', async () => {
      mockDataSource.query.mockResolvedValue([]);
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
      delete process.env.RELAY_HOST;
      delete process.env.HBBR_HOST;

      const result = await controller.getHealth();

      expect(result.status).toBe('degraded');
      expect(result.services.relay).toBe('error');
    });

    it('should return degraded when keycloak returns non-ok', async () => {
      mockDataSource.query.mockResolvedValue([]);
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
      process.env.RELAY_HOST = 'relay.example.com';

      const result = await controller.getHealth();

      expect(result.status).toBe('degraded');
      expect(result.services.keycloak).toBe('error');
    });
  });
});
