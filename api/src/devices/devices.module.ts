import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from '../database/entities/device.entity';
import { Group } from '../database/entities/group.entity';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';

@Module({
  imports: [TypeOrmModule.forFeature([Device, Group])],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}
