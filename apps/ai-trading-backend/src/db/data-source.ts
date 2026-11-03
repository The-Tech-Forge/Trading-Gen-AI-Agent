import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [
    path.join(__dirname, '/../**/*.entity{.ts,.js}'),
    path.join(__dirname, '/../**/entities/**/*{.ts,.js}'),
  ],
  migrations: [path.join(__dirname, '/migrations/*{.ts,.js}')],
  ssl: process.env.DB_SSL === 'true',
  extra:
    process.env.DB_SSL === 'true'
      ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
      : {},
});
