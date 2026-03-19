import { Test, TestingModule } from '@nestjs/testing';
import { DevicesService } from './devices.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Device } from '../database/entities/device.entity';
import { Repository } from 'typeorm';

const mockDeviceRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  }),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('DevicesService', () => {
  let service: DevicesService;
  let deviceRepository: MockRepository<Device>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevicesService,
        {
          provide: getRepositoryToken(Device),
          useFactory: mockDeviceRepository,
        },
      ],
    }).compile();

    service = module.get<DevicesService>(DevicesService);
    deviceRepository = module.get<MockRepository<Device>>(getRepositoryToken(Device));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRustdeskPeers', () => {
    it('should return mapped peers', async () => {
      const devices = [
        { rustdesk_id: '1', alias: 'A1', hostname: 'H1', os: 'Linux', online: true, group: { name: 'G1' } },
      ];
      deviceRepository.find.mockResolvedValue(devices);

      const result = await service.getRustdeskPeers({});
      expect(result.data[0].id).toBe('1');
      expect(result.data[0].tags).toContain('G1');
      expect(result.data[0].status).toBe(1);
    });

    it('should handle device without group', async () => {
      const devices = [
        { rustdesk_id: '2', alias: 'A2', hostname: 'H2', os: 'Linux', online: false, group: null, tags: ['tag1'] },
      ];
      deviceRepository.find.mockResolvedValue(devices);

      const result = await service.getRustdeskPeers({});
      expect(result.data[0].tags).toEqual(['tag1']);
      expect(result.data[0].status).toBe(0);
    });
  });

  describe('findAll', () => {
    it('should call query builder with pagination', async () => {
      await service.findAll({ page: 2, limit: 10 });
      expect(deviceRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should apply filters (groupId, online, search, tag)', async () => {
      const mockQb = deviceRepository.createQueryBuilder();
      await service.findAll({ 
        groupId: 'g1', 
        online: 'true', 
        search: 'test', 
        tag: 'tag1' 
      });
      
      expect(mockQb.andWhere).toHaveBeenCalledWith('group.id = :groupId', { groupId: 'g1' });
      expect(mockQb.andWhere).toHaveBeenCalledWith('device.online = :online', { online: true });
      expect(mockQb.andWhere).toHaveBeenCalledWith('(device.alias ILIKE :search OR device.hostname ILIKE :search)', { search: '%test%' });
      expect(mockQb.andWhere).toHaveBeenCalledWith(':tag = ANY(device.tags)', { tag: 'tag1' });
    });
  });

  describe('findOne', () => {
    it('should return a device if found', async () => {
      const device = { id: '1' };
      deviceRepository.findOne.mockResolvedValue(device);
      const result = await service.findOne('1');
      expect(result).toEqual(device);
    });

    it('should throw if not found', async () => {
      deviceRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow('Device not found');
    });
  });

  describe('update', () => {
    it('should update and save a device', async () => {
      const device = { id: '1', alias: 'old', tags: ['t1'], group: null };
      deviceRepository.findOne.mockResolvedValue(device);
      deviceRepository.save.mockResolvedValue({ ...device, alias: 'new' });

      const result = await service.update('1', { alias: 'new', tags: ['t2'], group_id: 'g2' });
      expect(deviceRepository.save).toHaveBeenCalled();
      expect(result.alias).toBe('new');
      expect(device.tags).toEqual(['t2']);
      expect(device.group).toEqual({ id: 'g2' });
    });
  });

  describe('remove', () => {
    it('should delete a device', async () => {
      await service.remove('1');
      expect(deviceRepository.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('generateConnectLink', () => {
    it('should return a rustdesk link', async () => {
      deviceRepository.findOne.mockResolvedValue({ rustdesk_id: '123' });
      const result = await service.generateConnectLink('1');
      expect(result.deep_link).toBe('rustdesk://123');
    });
  });

  describe('seedDemoDevices', () => {
    it('should seed if empty', async () => {
      deviceRepository.count.mockResolvedValue(0);
      deviceRepository.create.mockReturnValue({});
      deviceRepository.save.mockResolvedValue([]);
      const result = await service.seedDemoDevices();
      expect(result.status).toBe('Seeded');
    });

    it('should not seed if not empty', async () => {
      deviceRepository.count.mockResolvedValue(5);
      const result = await service.seedDemoDevices();
      expect(result.status).toBe('Already seeded');
    });
  });

  describe('create', () => {
    it('should create and save a device', async () => {
      const dto = { rustdesk_id: '123' };
      deviceRepository.create.mockReturnValue(dto);
      deviceRepository.save.mockResolvedValue({ id: '1', ...dto });

      const result = await service.create(dto);
      expect(deviceRepository.create).toHaveBeenCalled();
      expect(deviceRepository.save).toHaveBeenCalled();
      expect(result.id).toBe('1');
    });

    it('should create with group_id', async () => {
      const dto = { rustdesk_id: '123', group_id: 'g1' };
      deviceRepository.create.mockReturnValue(dto);
      deviceRepository.save.mockResolvedValue({ id: '1', ...dto });
      await service.create(dto);
      expect(deviceRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        group: { id: 'g1' }
      }));
    });

    it('should create without group_id', async () => {
      const dto = { rustdesk_id: '123' };
      deviceRepository.create.mockReturnValue(dto);
      deviceRepository.save.mockResolvedValue({ id: '1', ...dto });
      await service.create(dto);
      expect(deviceRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        group: null
      }));
    });
  });

  describe('exportToCsv', () => {
    it('should return devices as CSV string', async () => {
      const devices = [
        { rustdesk_id: 'ID1', alias: 'A1', hostname: 'H1', os: 'Linux', online: true, tags: ['T1', 'T2'] },
        { rustdesk_id: 'ID2', alias: 'A2', hostname: 'H2', os: 'Windows', online: false, tags: [] },
      ];
      deviceRepository.find.mockResolvedValue(devices);

      const csv = await service.exportToCsv();
      
      expect(csv).toContain('rustdesk_id,alias,hostname,os,online,tags');
      expect(csv).toContain('ID1,A1,H1,Linux,true,"T1,T2"');
      expect(csv).toContain('ID2,A2,H2,Windows,false,""');
    });
  });

  describe('importFromCsv', () => {
    it('should parse CSV and create devices', async () => {
      const csv = 'rustdesk_id,alias,hostname,os,online,tags\nID3,A3,H3,macOS,true,"T3,T4"';
      deviceRepository.save.mockResolvedValue([]);
      
      await service.importFromCsv(csv);
      
      expect(deviceRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        rustdesk_id: 'ID3',
        alias: 'A3',
        hostname: 'H3',
        os: 'macOS',
        online: true,
        tags: ['T3', 'T4']
      }));
      expect(deviceRepository.save).toHaveBeenCalled();
    });

    it('should ignore header and handle empty tags', async () => {
      const csv = 'rustdesk_id,alias,hostname,os,online,tags\nID4,A4,H4,Linux,false,""';
      await service.importFromCsv(csv);
      expect(deviceRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        rustdesk_id: 'ID4',
        tags: []
      }));
    });

    it('should handle empty csv or only header', async () => {
      const csv = 'rustdesk_id,alias,hostname,os,online,tags\n';
      await service.importFromCsv(csv);
      expect(deviceRepository.save).toHaveBeenCalledWith([]);
    });

    it('should skip malformed lines (empty or wrong format)', async () => {
      // Uma linha vazia deve ser ignorada pelo regex/filter
      const csv = 'rustdesk_id,alias,hostname,os,online,tags\n\nID5,A5,H5,Linux,true,"T5"';
      await service.importFromCsv(csv);
      expect(deviceRepository.create).toHaveBeenCalledTimes(1);
    });
  });
});
