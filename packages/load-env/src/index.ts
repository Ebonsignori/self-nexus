import fs from 'fs';
import dotenvFlow from 'dotenv-flow';
import path from 'path';

export default function loadEnv(processGlobal = process, opts: {
  envPath = './.env',
  shouldLog = false,
}) {

  let shouldLog = true;
  if (process.env.SILENT_LOAD_ENV === 'true') {
    shouldLog = false;
  }

  export default function loadEnv(): boolean {
    // Prevent loadEnv from being called twice in same running instance
    if (process.env.ENVIRONMENT_LOADED === 'true') {
      shouldLog = false;
      return false;
    }
    process.env.ENVIRONMENT_LOADED = 'true';

    // Production builds won't try to read from filesystem for environment
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.VARIABLE_ENV) {
        if (shouldLog) {
          console.log('VARIABLE_ENV not specified in production, not injecting environment.');
        }
        return false;
      }
      let variableEnv = process.env.VARIABLE_ENV.toUpperCase();
      if (variableEnv === 'MASTER') { // master branch uses PRODUCTION_ prefixed env vars
        variableEnv = 'PRODUCTION';
      }

      // Overwrite environment from shell env where each variable will be prefixed by "<VARIABLE_ENV>_" e.g. TEST_DB_HOST
      let injectedVariables = 0;
      Object.entries(process.env).forEach(([key, value]) => {
        if (typeof key === 'string'
            && key.split('_')[0] === variableEnv) {
          injectedVariables += 1;
          const adjustedKey = key.slice(key.indexOf('_') + 1, key.length);
          process.env[adjustedKey] = value;
        }
      });
      if (shouldLog) {
        console.log(`Injected ${injectedVariables} ${variableEnv}_ prefixed envs.`);
      }
      return true;
    }

    const envPaths = [];

    const dotEnvPath = path.join(__filename, '..', '..', '..', '.env');
    const secretPath = path.join(__filename, '..', '..', '..', '.env.secrets');
    try {
      if (fs.existsSync(secretPath)) {
        envPaths.push(secretPath);
      } else if (shouldLog) {
        console.log('No .env.secrets file found in root directory');
      }
      if (fs.existsSync(dotEnvPath)) {
        envPaths.push(dotEnvPath);
      } else if (shouldLog) {
        console.log('No .env file found in root directory');
      }
    } catch (err) {
      console.error(err);
    }

    // Get obj of envVars from files
    const environmentVars = dotenvFlow.parse(envPaths);

    // Set global env vars from files, but don't overwrite anything in application level
    Object.entries(environmentVars).forEach(([key, value]) => {
      if (typeof process.env[key] === 'undefined') {
        process.env[key] = value;
      }
    });

    // overwrite envs with DOCKER_ prefixed env vars if necessary
    let hasSomeDockerVar = false;
    Object.entries(process.env).forEach(([key, value]) => {
      // If a DOCKER_ variable passed in from compose, overwrite global env var with docker env var
      if (typeof key === 'string' && key.split('_')[0] === 'DOCKER') {
        hasSomeDockerVar = true;
        const adjustedKey = key.slice(key.indexOf('_') + 1, key.length);
        process.env[adjustedKey] = value;
      }
    });

    // If NODE_ENV=test, overwrite envs with TESTING_ prefixed env vars if necessary
    if (process.env.NODE_ENV === 'test') {
      Object.entries(process.env).forEach(([key, value]) => {
        // If a TESTING_ variable, overwrite global env var with TESTING env var
        if (typeof key === 'string' && key.split('_')[0] === 'TESTING') {
          const adjustedKey = key.slice(key.indexOf('_') + 1, key.length);
          process.env[adjustedKey] = value;
        }
      });
    }

    if (hasSomeDockerVar && shouldLog) {
      console.log('Application has a DOCKER_ prefixed env and is using variables injected via docker-compose');
    }

    return true;
  }
}
