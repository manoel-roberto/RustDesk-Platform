import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../database/entities/audit-log.entity';

@ApiTags('Auditoria')
@Controller('audit')
export class AuditController {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  @Get()
  async findAll(@Query() query: any) {
    const { page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const [items, total] = await this.auditLogRepository.findAndCount({
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });

    return {
      data: items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
