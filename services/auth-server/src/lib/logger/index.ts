import { executionAsyncResource } from 'async_hooks';
import {
  getInitLogger,
  LEVELS,
} from './initWinstonLogger';
import {
  loggerOpts,
  loggerType,
  LogLevelStrings,
} from '../../types/common';
import { LOGGER_CONTEXT } from '../constants/asyncHooks';

const winstonLogger = getInitLogger();

// Import Logger in other modules like: `import Logger from '../logger'`
// Then init an instance with `const logger = Logger(module, moduleOpts)`
export default (
  module: NodeModule | { id: string },
  moduleOpts: loggerOpts = { customInput: {} }
): loggerType => {
  if (!module) {
    getInitLogger().warn(`
      Logger not initialized correctly. Default export is builder function that requires module to be passed.
      For example:

      import Logger from '../logger';
      const logger = Logger(module);
    `);
  }
  const filename = module.id;

  /* Example:
     logger.info('My message', { customInput: { id: 5, name: bob } })
     Will output:
     [type]='info' [date]='2020-04-05 01:28:17' [file]='src/server.js' [message]='My message' [id]=5 [name]=bob
  */
  const logger: loggerType = {};
  Object.keys(LEVELS).forEach((level: LogLevelStrings) => {
    logger[level] = (
      msg: string,
      options: loggerOpts = { customInput: {} }
    ): void => {
      // When using logger.test() just console log results
      if (level === 'test') {
        // eslint-disable-next-line no-console
        console.log(msg);
      }
      const context = executionAsyncResource()[LOGGER_CONTEXT];

      // eslint-disable-next-line
      // @ts-ignore
      winstonLogger[level](
        msg,
        {
          customInput: {
            ...options.customInput,
            ...moduleOpts.customInput,
            ...(context?.reqSessionId && { reqSessionId: context.reqSessionId }),
            ...(context?.clientName && { clientName: context.clientName }),
          },
          filename,
        }
      );
    };
  });

  return logger;
};
