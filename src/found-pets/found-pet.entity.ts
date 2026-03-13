import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Point } from 'typeorm';

@Entity('found_pets')
export class FoundPet {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  species!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  breed!: string | null;

  @Column({ length: 100 })
  color!: string;

  @Column({ length: 50 })
  size!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ name: 'photo_url', type: 'varchar', length: 500, nullable: true })
  photoUrl!: string | null;

  @Column({ name: 'finder_name', length: 255 })
  finderName!: string;

  @Column({ name: 'finder_email', length: 255 })
  finderEmail!: string;

  @Column({ name: 'finder_phone', length: 30 })
  finderPhone!: string;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326 })
  location!: Point;

  @Column({ length: 255 })
  address!: string;

  @Column({ name: 'found_date', type: 'timestamp' })
  foundDate!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
