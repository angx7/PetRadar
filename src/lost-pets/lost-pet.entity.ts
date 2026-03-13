import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Point } from 'typeorm';

@Entity('lost_pets')
export class LostPet {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 100 })
  species!: string;

  @Column({ length: 100 })
  breed!: string;

  @Column({ length: 100 })
  color!: string;

  @Column({ length: 50 })
  size!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ name: 'photo_url', type: 'varchar', length: 500, nullable: true })
  photoUrl!: string | null;

  @Column({ name: 'owner_name', length: 255 })
  ownerName!: string;

  @Column({ name: 'owner_email', length: 255 })
  ownerEmail!: string;

  @Column({ name: 'owner_phone', length: 30 })
  ownerPhone!: string;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326 })
  location!: Point;

  @Column({ length: 255 })
  address!: string;

  @Column({ name: 'lost_date', type: 'timestamp' })
  lostDate!: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
