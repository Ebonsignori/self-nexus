import http from 'http';
import express from 'express';
import { createConnection, getConnectionOptions, Connection } from 'typeorm';
import Logger from './lib/logger';
import TypeOrmLogger from './lib/logger/TypeormLogger';

const logger = Logger(module);

const { AUTH_SERVER_PORT } = process.env;

// Export expressApp, running express server, and TypeORM connection for testing suite to access
export const expressApp = express();
let typeOrmConnection: Connection;
let listeningExpressApp: http.Server;

export const getAsyncExports = (): object => ({
  typeOrmConnection,
  listeningExpressApp,
});

async function main(): Promise<void> {
  // - - - - - - - -
  // TypeOrm database
  // - - - - - - - -
  const connectionOptions = await getConnectionOptions();
  typeOrmConnection = await createConnection({
    ...connectionOptions,
    logger: new TypeOrmLogger(),
  });
  if (process.env.RUN_MIGRATIONS_ON_START === 'true') {
    await typeOrmConnection.runMigrations();
  }

  // - - - - - - - -
  // Express Server Config
  // - - - - - - - -
  // Lazy-load routes
  expressApp.use('', require('./rest/routes').default);

  // - - - - - - - -
  // Start Server
  // - - - - - - - -
  listeningExpressApp = expressApp.listen(AUTH_SERVER_PORT, () => {
    expressApp.emit('started'); // emit started event to notify testing suite that server is ready
    logger.info(`Auth Server started on port: ${AUTH_SERVER_PORT}!`);
  });
}

// Application entry point
try {
  main();
} catch (error) {
  logger.error('Uncaught server error ocurred', { customInput: { error } });
}
