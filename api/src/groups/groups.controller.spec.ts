import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

const mockGroupsService = () => ({
  findAll: jest.fn().mockResolvedValue({ data: [] }),
  findTree: jest.fn().mockResolvedValue({ data: [] }),
  findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Group', children: [] }),
  create: jest.fn().mockResolvedValue({ id: '1', name: 'Group' }),
});

describe('GroupsController', () => {
  let controller: GroupsController;
  let service: ReturnType<typeof mockGroupsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        {
          provide: GroupsService,
          useFactory: mockGroupsService,
        },
      ],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
    service = module.get(GroupsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call findTree', async () => {
    const result = await controller.findTree();
    expect(service.findTree).toHaveBeenCalled();
    expect(result.data).toBeDefined();
  });

  it('should call findOne', async () => {
    const result = await controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith('1');
    expect(result.id).toBe('1');
  });

  it('should call create with parent_id', async () => {
    const dto = { name: 'Sub', parent_id: 'parent-1' };
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call create without parent', async () => {
    const dto = { name: 'G1' };
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
