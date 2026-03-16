import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Device } from './device.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true, name: 'parent_id' })
  parent_id: string | null;

  @ManyToOne(() => Group, group => group.children, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent: Group;

  @OneToMany(() => Group, group => group.parent)
  children: Group[];

  @OneToMany(() => Device, device => device.group)
  devices: Device[];
}
