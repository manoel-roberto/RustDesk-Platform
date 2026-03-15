import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Device } from './device.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Device)
  @JoinColumn({ name: 'device_id' })
  device: Device;

  @Column()
  technician_id: string;

  @CreateDateColumn()
  started_at: Date;

  @Column({ nullable: true })
  ended_at: Date;

  @Column({ default: false })
  relay_used: boolean;

  @Column({ nullable: true })
  notes: string;

  @Column({ default: 'support' })
  session_type: string;
}
