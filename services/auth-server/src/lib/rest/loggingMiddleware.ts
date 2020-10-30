import express from 'express';
import Logger from '../../lib/logger';

const logger = Logger(module);

// Logging for rest routes
export default (req: express.Request, res: express.Response, next: express.NextFunction): any => {
  logger.debug('Rest route hit', { customInput: { restMethod: req?.method, restEndpoint: req?.originalUrl } });
  logger.rest('Rest route hit (detailed)', {
    customInput: {
      restMethod: req?.method,
      restEndpoint: req?.originalUrl,
      restBody: JSON.stringify(typeof req?.body === 'object' || {}),
      respStatusCode: res?.statusCode,
      respMessage: res?.statusMessage,
    },
  });
  next();
};
