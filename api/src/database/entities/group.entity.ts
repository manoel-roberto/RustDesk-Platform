import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Device } from './device.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Device, device => device.group)
  devices: Device[];
}
