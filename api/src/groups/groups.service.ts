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
      parent_id: g.parent_id || null,
      device_count: g.devices?.length || 0,
      online_count: g.devices?.filter(d => d.online).length || 0
    }));

    return { data: mapped as any };
  }

  async findTree(): Promise<{ data: any[] }> {
    const groups = await this.groupRepository.find({
      relations: ['devices', 'children', 'parent'],
    });

    // Build tree: filter top-level groups (no parent) and attach children recursively
    const buildNode = (group: Group): any => ({
      id: group.id,
      name: group.name,
      description: group.description,
      parent_id: group.parent_id || null,
      device_count: group.devices?.length || 0,
      children: (group.children || []).map(buildNode),
    });

    const topLevel = groups.filter(g => !g.parent_id);
    return { data: topLevel.map(buildNode) };
  }

  async create(createGroupDto: { name: string; description?: string; parent_id?: string }): Promise<Group> {
    const groupData: Partial<Group> = {
      name: createGroupDto.name,
      description: createGroupDto.description,
      parent_id: createGroupDto.parent_id || null,
    };
    const group = this.groupRepository.create(groupData);
    return this.groupRepository.save(group);
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupRepository.findOne({ where: { id }, relations: ['children', 'devices'] });
    if (!group) throw new NotFoundException(`Group ${id} not found`);
    return group;
  }
}
