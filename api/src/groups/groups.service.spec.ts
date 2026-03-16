import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Group } from '../database/entities/group.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockGroupRepository = () => ({
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
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
        { id: '1', name: 'G1', parent_id: null, devices: [{ online: true }, { online: false }] },
        { id: '2', name: 'G2', parent_id: null, devices: [] },
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

  describe('findTree', () => {
    it('should return hierarchical group tree', async () => {
      const child = { id: 'child-1', name: 'Sub-Grupo', parent_id: 'parent-1', devices: [], children: [] };
      const parent = { id: 'parent-1', name: 'Pai', parent_id: null, devices: [], children: [child] };
      groupRepository.find.mockResolvedValue([parent, child]);

      const result = await service.findTree();
      expect(result.data).toHaveLength(1); // Only top-level
      expect(result.data[0].name).toBe('Pai');
      expect(result.data[0].children).toHaveLength(1);
      expect(result.data[0].children[0].name).toBe('Sub-Grupo');
    });

    it('should return empty tree when no groups', async () => {
      groupRepository.find.mockResolvedValue([]);
      const result = await service.findTree();
      expect(result.data).toHaveLength(0);
    });
  });

  describe('create', () => {
    it('should create and save a group without parent', async () => {
      const dto = { name: 'New Group' };
      const saved = { id: '1', ...dto, parent_id: null };
      groupRepository.create.mockReturnValue(saved);
      groupRepository.save.mockResolvedValue(saved);

      const result = await service.create(dto);
      expect(result.id).toBe('1');
    });

    it('should create a sub-group with parent_id', async () => {
      const dto = { name: 'Sub-Grupo', parent_id: 'parent-1' };
      const saved = { id: '2', ...dto };
      groupRepository.create.mockReturnValue(saved);
      groupRepository.save.mockResolvedValue(saved);

      const result = await service.create(dto);
      expect(result.id).toBe('2');
    });
  });

  describe('findOne', () => {
    it('should return a group by id', async () => {
      const group = { id: '1', name: 'G1', children: [], devices: [] };
      groupRepository.findOne.mockResolvedValue(group);

      const result = await service.findOne('1');
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if not found', async () => {
      groupRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });
});
