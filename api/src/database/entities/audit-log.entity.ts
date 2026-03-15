import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  username: string;

  @Column()
  action: string; // CREATE, UPDATE, DELETE

  @Column()
  resource: string; // Devices, Groups, Users

  @Column({ type: 'jsonb', nullable: true })
  payload: any;

  @Column({ nullable: true })
  ipAddress: string;

  @CreateDateColumn()
  createdAt: Date;
}
