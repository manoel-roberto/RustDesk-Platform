import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Session } from '../database/entities/session.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockSessionRepository = () => ({
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  }),
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('SessionsService', () => {
  let service: SessionsService;
  let sessionRepository: MockRepository<Session>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: getRepositoryToken(Session),
          useFactory: mockSessionRepository,
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    sessionRepository = module.get<MockRepository<Session>>(getRepositoryToken(Session));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should call createQueryBuilder and return data with duration', async () => {
      const now = new Date();
      const before = new Date(now.getTime() - 10000); // 10s ago
      const mockSessions = [{ id: '1', started_at: before, ended_at: now }];
      sessionRepository.createQueryBuilder().getMany.mockResolvedValue(mockSessions);

      const result = await service.findAll({});
      expect((result.data[0] as any).duration).toBe(10);
    });
  });

  describe('startSession', () => {
    it('should create and save a new session', async () => {
      const userId = 'user-1';
      const dto = { device_id: 'device-1' };
      const session = { id: 'session-1', ...dto, technician_id: userId };
      
      sessionRepository.create.mockReturnValue(session);
      sessionRepository.save.mockResolvedValue(session);

      const result = await service.startSession(userId, dto);
      expect(sessionRepository.create).toHaveBeenCalled();
      expect(sessionRepository.save).toHaveBeenCalledWith(session);
      expect(result).toEqual(session);
    });
  });

  describe('closeSession', () => {
    it('should close an existing session', async () => {
      const sessionId = 'session-1';
      const userId = 'user-1';
      const existingSession = { id: sessionId, technician_id: userId, ended_at: null };
      const savedSession = { ...existingSession, ended_at: expect.any(Date) };

      sessionRepository.findOne.mockResolvedValue(existingSession);
      sessionRepository.save.mockResolvedValue(savedSession);

      const result = await service.closeSession(sessionId, userId, {});
      expect(sessionRepository.findOne).toHaveBeenCalledWith({ where: { id: sessionId } });
      expect(sessionRepository.save).toHaveBeenCalled();
      expect(result.ended_at).toBeDefined();
    });

    it('should throw NotFoundException if session does not exist', async () => {
      sessionRepository.findOne.mockResolvedValue(null);
      await expect(service.closeSession('invalid', 'user', {})).rejects.toThrow(NotFoundException);
    });

    it('should update notes and session_type', async () => {
      const sessionId = 'session-1';
      const userId = 'user-1';
      const existingSession = { id: sessionId, technician_id: userId, ended_at: null };
      
      sessionRepository.findOne.mockResolvedValue(existingSession);
      sessionRepository.save.mockImplementation(s => Promise.resolve(s as any));

      const result = await service.closeSession(sessionId, userId, { notes: 'updated', session_type: 'remote' });
      expect(result.notes).toBe('updated');
      expect(result.session_type).toBe('remote');
    });
  });

  describe('findAll filters', () => {
    it('should apply filters', async () => {
      await service.findAll({ deviceId: 'd1', technicianId: 't1', active: 'true' });
      expect(sessionRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('updateSession', () => {
    it('should update and save a session', async () => {
      const sessionId = 'session-1';
      const existingSession = { id: sessionId, notes: 'old' };
      
      sessionRepository.findOne.mockResolvedValue(existingSession);
      sessionRepository.save.mockImplementation(s => Promise.resolve(s as any));

      const result = await service.updateSession(sessionId, { notes: 'new', session_type: 'maintenance' });
      expect(result.notes).toBe('new');
      expect(result.session_type).toBe('maintenance');
    });

    it('should throw NotFoundException if session not found', async () => {
      sessionRepository.findOne.mockResolvedValue(null);
      await expect(service.updateSession('invalid', {})).rejects.toThrow(NotFoundException);
    });
  });
});
