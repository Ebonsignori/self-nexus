
const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

// Load env for typeorm migration cli command
try {
  // eslint-disable-next-line global-require
  const loadEnv = require('./src/lib/loadEnv');
  loadEnv.default();
// eslint-disable-next-line no-empty
} catch (err) {}

module.exports = {
  type: 'postgres',
  host: process.env.PG_HOST,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB_NAME,
  port: process.env.PG_PORT,
  // Generate and run migrations
  // Don't commit with synchronize: true
  synchronize: false,
  entities: [
    'src/models/**/*{.ts,.js}',
  ],
  migrationsTableName: 'migration_records',
  migrations: [
    'migrations/**/*{.ts,.js}',
  ],
  // The order of the filenames in the subscribers directory is the order in which they are executed
  subscribers: [
    'src/subscribers/**/*{.ts,.js}',
  ],
  cli: {
    entitiesDir: 'src/models',
    migrationsDir: 'migrations',
  },
  namingStrategy: new SnakeNamingStrategy(),
};
