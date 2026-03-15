import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

const mockGroupsService = () => ({
  findAll: jest.fn().mockResolvedValue({ data: [] }),
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

  it('should call create', async () => {
    const dto = { name: 'G1' };
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
