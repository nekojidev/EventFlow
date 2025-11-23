import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from './app.config';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: config.database.synchronize,
  logging: config.database.logging,
};

export const AppDataSource = new DataSource(databaseConfig);