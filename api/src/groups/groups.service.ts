import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../database/entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async findAll(): Promise<{ data: Group[] }> {
    const groups = await this.groupRepository.find({
      relations: ['devices'],
    });

    const mapped = groups.map(g => ({
      id: g.id,
      name: g.name,
      description: g.description,
      device_count: g.devices?.length || 0,
      online_count: g.devices?.filter(d => d.online).length || 0
    }));

    return { data: mapped as any };
  }

  async create(createGroupDto: { name: string; description?: string }): Promise<Group> {
    const group = this.groupRepository.create(createGroupDto);
    return this.groupRepository.save(group);
  }
}
