import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { Group } from './entities/group.entity';
import { Session } from './entities/session.entity';
import { AuditLog } from './entities/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5433', 10), // Usando 5433 caso local, no docker usa 5432 via env
      username: process.env.POSTGRES_USER || 'empresa_admin',
      password: process.env.POSTGRES_PASSWORD || 'super_secret_db_pass',
      database: process.env.POSTGRES_DB || 'rustdesk_platform',
      entities: [Device, Group, Session, AuditLog],
      synchronize: true, // Em producao seria false + migrations
    }),
  ],
})
export class DatabaseModule {}
