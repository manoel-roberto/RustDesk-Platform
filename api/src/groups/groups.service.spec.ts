import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Group } from '../database/entities/group.entity';
import { Repository } from 'typeorm';

const mockGroupRepository = () => ({
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('GroupsService', () => {
  let service: GroupsService;
  let groupRepository: MockRepository<Group>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: getRepositoryToken(Group),
          useFactory: mockGroupRepository,
        },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
    groupRepository = module.get<MockRepository<Group>>(getRepositoryToken(Group));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return mapped groups with counts', async () => {
      const groups = [
        { id: '1', name: 'G1', devices: [{ online: true }, { online: false }] },
        { id: '2', name: 'G2', devices: [] },
      ];
      groupRepository.find.mockResolvedValue(groups);

      const result = await service.findAll();
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toEqual(expect.objectContaining({
        id: '1',
        name: 'G1',
        device_count: 2,
        online_count: 1,
      }));
      expect((result.data[1] as any).device_count).toBe(0);
    });

    it('should handle groups with null devices', async () => {
      groupRepository.find.mockResolvedValue([{ id: '1', name: 'G1', devices: null }]);
      const result = await service.findAll();
      expect((result.data[0] as any).device_count).toBe(0);
    });
  });

  describe('create', () => {
    it('should create and save a group', async () => {
      const dto = { name: 'New Group' };
      groupRepository.create.mockReturnValue(dto);
      groupRepository.save.mockResolvedValue({ id: '1', ...dto });

      const result = await service.create(dto);
      expect(groupRepository.create).toHaveBeenCalledWith(dto);
      expect(groupRepository.save).toHaveBeenCalled();
      expect(result.id).toBe('1');
    });
  });
});
