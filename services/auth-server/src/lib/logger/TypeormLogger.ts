/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger as TypeOrmLoggerInterface, QueryRunner } from 'typeorm';
import Logger from '.';

const logger = Logger({ id: 'TypeOrmLogger' });

export default class TypeOrmLogger implements TypeOrmLoggerInterface {
  argsToCustomInput(args: { message?: any }): object {
    let customInput: { message?: any; typeOrmMessage?: any } = args;
    if (args.message) {
      customInput = {
        ...args,
        typeOrmMessage: args.message,
      };
    }
    return customInput;
  }

  _logger = {
    typeorm: (typeOfLog = 'TypeOrm Log', args): void => {
      logger.typeorm(typeOfLog, { customInput: this.argsToCustomInput(args) });
    },
    warn: (typeOfLog = 'TypeOrm Warn Log', args): void => {
      logger.warn(typeOfLog, { customInput: this.argsToCustomInput(args) });
    },
    error: (typeOfLog = 'TypeOrm Error Log', args): void => {
      if (args?.error?.message?.includes('duplicate key value violates unique constraint')) {
        logger.debug(`Duplicate key: "${args[0]}" violates unique constraint in database.`);
      } else {
        logger.error(typeOfLog, { customInput: this.argsToCustomInput(args) });
      }
    },
  };

  public log(level: 'log' | 'info' | 'warn', typeOrmMessage: any, queryRunner?: QueryRunner): any {
    let logLevel;
    switch (level) {
      case 'log':
        logLevel = logger.typeorm;
        break;
      case 'info':
        logLevel = logger.typeorm;
        break;
      case 'warn':
        logLevel = logger.warn;
        break;
      default:
        logLevel = logger.trace;
        break;
    }
    logLevel(typeOrmMessage);
  }

  public logMigration(typeOrmMessage: string, queryRunner?: QueryRunner): any {
    this._logger.typeorm('logMigration', { typeOrmMessage });
  }

  public logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    this._logger.typeorm('logQuery', { query, ...(parameters || {}) });
  }

  public logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    this._logger.error('logQueryError', { query, error, ...(parameters || {}) });
  }

  public logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    this._logger.error('logQuerySlow', { query, time, ...(parameters || {}) });
  }

  public logSchemaBuild(typeOrmMessage: string, queryRunner?: QueryRunner): any {
    this._logger.typeorm('logSchemaBuild', { typeOrmMessage });
  }
}
