import { DataSource, DataSourceOptions } from 'typeorm';
import { envs } from '../config/envs';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  entities: [],
  synchronize: true,
};

export const dataSource = new DataSource(dataSourceOptions);
