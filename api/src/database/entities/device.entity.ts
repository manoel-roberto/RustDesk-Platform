import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Group } from './group.entity';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  rustdesk_id: string;

  @Column()
  alias: string;

  @Column()
  hostname: string;

  @Column({ default: 'Windows' })
  os: string;

  @Column({ default: true })
  online: boolean;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @ManyToOne(() => Group, group => group.devices, { eager: true, nullable: true })
  @JoinColumn({ name: 'group_id' })
  group: Group;
}
