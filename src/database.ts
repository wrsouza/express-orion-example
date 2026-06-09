import { createConnection } from '@wrsouza/orion';

export default createConnection({
  connection: process.env.DATABASE_URL ?? {
    driver: 'postgres',
    host:     process.env.DB_HOST     ?? 'localhost',
    port:     Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME     ?? 'myapp',
    user:     process.env.DB_USER     ?? 'postgres',
    password: process.env.DB_PASS     ?? 'postgres',
    pool: { max: 10 },
  },
  migrations: {
    path:  './src/database/migrations',
    table: 'orion_migrations',
  },
  preventLazyLoading: process.env.NODE_ENV !== 'production',
});
