import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Session } from '../database/entities/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async findAll(query: any): Promise<{ data: Session[] }> {
    const qb = this.sessionRepository.createQueryBuilder('session')
      .leftJoinAndSelect('session.device', 'device');

    if (query.deviceId) qb.andWhere('device.id = :deviceId', { deviceId: query.deviceId });
    if (query.technicianId) qb.andWhere('session.technician_id = :techId', { techId: query.technicianId });
    if (query.active === 'true') qb.andWhere('session.ended_at IS NULL');

    const data = await qb.getMany();
    
    // Calcular duração para sessões finalizadas
    const dataWithDuration = data.map(session => {
      let duration = 0;
      if (session.started_at && session.ended_at) {
        duration = Math.floor((session.ended_at.getTime() - session.started_at.getTime()) / 1000);
      }
      return { ...session, duration };
    });

    return { data: dataWithDuration as any };
  }

  async startSession(userId: string, createSessionDto: any): Promise<Session> {
    const session = this.sessionRepository.create({
      device: { id: createSessionDto.device_id } as any,
      technician_id: userId,
      session_type: createSessionDto.session_type || 'support',
      relay_used: false, // Defaulting, would be detected by RustDesk custom plugin later
    });
    return this.sessionRepository.save(session);
  }

  async closeSession(id: string, userId: string, updateDto: any): Promise<Session> {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) throw new NotFoundException('Session not found');

    // Aqui poderia verificar se session.technician_id === userId

    session.ended_at = new Date();
    if (updateDto.notes) session.notes = updateDto.notes;
    if (updateDto.session_type) session.session_type = updateDto.session_type;

    return this.sessionRepository.save(session);
  }

  async updateSession(id: string, updateDto: any): Promise<Session> {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) throw new NotFoundException('Session not found');

    if (updateDto.notes !== undefined) session.notes = updateDto.notes;
    if (updateDto.session_type !== undefined) session.session_type = updateDto.session_type;

    return this.sessionRepository.save(session);
  }
}
