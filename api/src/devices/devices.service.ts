import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../database/entities/device.entity';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  async getRustdeskPeers(user: any): Promise<any> {
    const devices = await this.deviceRepository.find({ relations: ['group'] });

    return {
      data: devices.map((d) => ({
        id: d.rustdesk_id,
        username: d.alias,
        hostname: d.hostname,
        alias: d.alias,
        platform: d.os,
        tags: d.group?.name ? [d.group.name, ...(d.tags || [])] : d.tags || [],
        hash: '', 
        status: d.online ? 1 : 0, 
      })),
    };
  }

  // --- REST CRUD API (API-DEV) ---

  async findAll(query: any): Promise<any> {
    const { page = 1, limit = 20, groupId, online, search, tag } = query;
    const skip = (page - 1) * limit;

    const qb = this.deviceRepository.createQueryBuilder('device')
      .leftJoinAndSelect('device.group', 'group');

    if (groupId) qb.andWhere('group.id = :groupId', { groupId });
    if (online !== undefined) qb.andWhere('device.online = :online', { online: String(online) === 'true' });
    if (search) qb.andWhere('(device.alias ILIKE :search OR device.hostname ILIKE :search)', { search: `%${search}%` });
    if (tag) qb.andWhere(':tag = ANY(device.tags)', { tag });

    const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data: items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: string): Promise<Device> {
    // Tenta por UUID primeiro (catch para evitar erro se não for formato UUID)
    let device = await this.deviceRepository.findOne({ where: { id }, relations: ['group'] }).catch(() => null);
    
    // Se não encontrar, tenta pelo rustdesk_id (que é o que o TechnicianPortal envia)
    if (!device) {
      device = await this.deviceRepository.findOne({ where: { rustdesk_id: id }, relations: ['group'] });
    }

    if (!device) throw new Error('Device not found');
    return device;
  }

  async create(createDto: any): Promise<Device> {
    const device = this.deviceRepository.create({
      rustdesk_id: createDto.rustdesk_id,
      alias: createDto.alias,
      hostname: createDto.hostname,
      os: createDto.os || 'Windows',
      tags: createDto.tags,
      // Se houvesse o group_id ele precisaria buscar o Group. Aqui mockamos para MVP:
      group: createDto.group_id ? { id: createDto.group_id } as any : null
    });
    return this.deviceRepository.save(device);
  }

  async update(id: string, updateDto: any): Promise<Device> {
    const device = await this.findOne(id);
    if (updateDto.alias) device.alias = updateDto.alias;
    if (updateDto.tags) device.tags = updateDto.tags;
    if (updateDto.group_id) device.group = { id: updateDto.group_id } as any;
    
    return this.deviceRepository.save(device);
  }

  async remove(id: string): Promise<void> {
    await this.deviceRepository.delete(id);
  }

  async generateConnectLink(id: string): Promise<any> {
    const device = await this.findOne(id);
    return {
      rustdesk_id: device.rustdesk_id,
      deep_link: `rustdesk://${device.rustdesk_id}`,
      access_level: 'full',
      expires_at: new Date(Date.now() + 3600 * 1000).toISOString()
    };
  }
  async seedDemoDevices() {
    const existing = await this.deviceRepository.count();
    if (existing > 0) return { status: 'Already seeded' };

    const dev1 = this.deviceRepository.create({
      rustdesk_id: '89101112',
      alias: 'Servidor ERP',
      hostname: 'SRV-ERP-01',
      os: 'Windows Server 2019',
      online: true,
      tags: ['servidor-critico'],
    });

    const dev2 = this.deviceRepository.create({
      rustdesk_id: '13141516',
      alias: 'PC Recepcao',
      hostname: 'DESKTOP-REC-01',
      os: 'Windows 11',
      online: false,
      tags: ['atendimento'],
    });

    await this.deviceRepository.save([dev1, dev2]);
    return { status: 'Seeded' };
  }
  
  async exportToCsv(): Promise<string> {
    const devices = await this.deviceRepository.find();
    const header = 'rustdesk_id,alias,hostname,os,online,tags';
    const rows = devices.map(d => {
      const tags = d.tags ? d.tags.join(',') : '';
      return `${d.rustdesk_id},${d.alias},${d.hostname},${d.os},${d.online},"${tags}"`;
    });
    return [header, ...rows].join('\n');
  }

  async importFromCsv(csv: string): Promise<void> {
    const lines = csv.trim().split('\n');
    const dataLines = lines.slice(1); // Ignorar header

    const devicesToCreate = dataLines.map(line => {
      // Regex para split por vírgula mas ignorar vírgulas dentro de aspas
      const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      if (!matches) return null;
      
      const [rustdesk_id, alias, hostname, os, online, tagsStrRaw] = matches.map(s => s.replace(/^"|"$/g, ''));
      const tags = tagsStrRaw ? tagsStrRaw.split(',').filter(t => t) : [];
      
      return this.deviceRepository.create({
        rustdesk_id,
        alias,
        hostname,
        os,
        online: online === 'true',
        tags
      });
    }).filter(d => d);

    await this.deviceRepository.save(devicesToCreate);
  }
}
