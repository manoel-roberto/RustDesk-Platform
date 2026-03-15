import { Test, TestingModule } from '@nestjs/testing';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

const mockSessionsService = () => ({
  findAll: jest.fn().mockResolvedValue({ data: [] }),
  startSession: jest.fn().mockResolvedValue({ id: '1' }),
  closeSession: jest.fn().mockResolvedValue({ id: '1', ended_at: new Date() }),
  updateSession: jest.fn().mockResolvedValue({ id: '1' }),
  getSessionStats: jest.fn().mockResolvedValue({ totalSessions: 5, totalHours: 2.5, avgMinutes: 30, totalSeconds: 9000 }),
});

describe('SessionsController', () => {
  let controller: SessionsController;
  let service: ReturnType<typeof mockSessionsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [
        {
          provide: SessionsService,
          useFactory: mockSessionsService,
        },
      ],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
    service = module.get(SessionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStats', () => {
    it('should call service.getSessionStats and return stats', async () => {
      const query = { startDate: '2024-01-01', endDate: '2024-01-31' };
      const result = await controller.getStats(query);
      expect(service.getSessionStats).toHaveBeenCalledWith(query);
      expect(result.totalSessions).toBe(5);
      expect(result.totalHours).toBe(2.5);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      const query = { deviceId: '1' };
      await controller.findAll(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('startSession', () => {
    it('should call service.startSession', async () => {
      const req = { user: { userId: 'user-1' } };
      const dto = { device_id: 'device-1' };
      await controller.startSession(req, dto);
      expect(service.startSession).toHaveBeenCalledWith('user-1', dto);
    });
  });

  describe('closeSession', () => {
    it('should call service.closeSession', async () => {
      const id = 'session-1';
      const req = { user: { userId: 'user-1' } };
      const dto = { notes: 'test' };
      await controller.closeSession(id, req, dto);
      expect(service.closeSession).toHaveBeenCalledWith(id, 'user-1', dto);
    });

    it('should call service.updateSession', async () => {
      const id = 'session-1';
      const dto = { notes: 'test' };
      await controller.updateSession(id, dto);
      expect(service.updateSession).toHaveBeenCalledWith(id, dto);
    });
  });
});
