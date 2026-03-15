import { Test, TestingModule } from '@nestjs/testing';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';

const mockDevicesService = () => ({
  findAll: jest.fn().mockResolvedValue({ data: [] }),
  findOne: jest.fn().mockResolvedValue({ id: '1' }),
  create: jest.fn().mockResolvedValue({ id: '1' }),
  update: jest.fn().mockResolvedValue({ id: '1' }),
  remove: jest.fn().mockResolvedValue(undefined),
  generateConnectLink: jest.fn().mockResolvedValue({}),
  getRustdeskPeers: jest.fn().mockResolvedValue({ data: [] }),
  seedDemoDevices: jest.fn().mockResolvedValue({ status: 'OK' }),
  exportToCsv: jest.fn().mockResolvedValue('csv_data'),
  importFromCsv: jest.fn().mockResolvedValue(undefined),
});

describe('DevicesController', () => {
  let controller: DevicesController;
  let service: ReturnType<typeof mockDevicesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesController],
      providers: [
        {
          provide: DevicesService,
          useFactory: mockDevicesService,
        },
      ],
    }).compile();

    controller = module.get<DevicesController>(DevicesController);
    service = module.get(DevicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll', async () => {
    await controller.findAllDevices({});
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call getPeers', async () => {
    const req = { user: {} };
    await controller.getPeers(req);
    expect(service.getRustdeskPeers).toHaveBeenCalled();
  });

  it('should call seed', async () => {
    await controller.seed();
    expect(service.seedDemoDevices).toHaveBeenCalled();
  });

  it('should call exportToCsv', async () => {
    await controller.exportDevices();
    expect(service.exportToCsv).toHaveBeenCalled();
  });

  it('should call importFromCsv', async () => {
    const body = { csv: 'data' };
    await controller.importDevices(body);
    expect(service.importFromCsv).toHaveBeenCalledWith('data');
  });
});
