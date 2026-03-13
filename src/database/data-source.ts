import { envs } from 'src/config/envs';
import { LostPet } from 'src/lost-pets/lost-pet.entity';
import { FoundPet } from 'src/found-pets/found-pet.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  host: envs.DB_HOST,
  database: envs.DB_NAME,
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
  port: envs.DB_PORT,
  type: 'postgres',
  entities: [LostPet, FoundPet],
  synchronize: false,
  migrations: ['dist/database/migrations/[0-9]*-*.js'],
};

export const dataSource = new DataSource(dataSourceOptions);
