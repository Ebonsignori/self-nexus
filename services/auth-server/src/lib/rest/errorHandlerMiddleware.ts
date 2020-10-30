import express from 'express';
import { RestError } from '../lib/restErrors';
import Logger from '../../lib/logger';

const logger = Logger(module);

// Custom error handler for rest routes
export default (error: RestError, req: express.Request, res: express.Response, next: express.NextFunction): any => {
  if (error instanceof RestError) {
    logger.error('Uncaught rest route error occurred', {
      customInput: { error: error?.error || error?.message || error, restEndpoint: req?.originalUrl },
    });
    next(res.status(error?.responseCode || 500).json({
      error: {
        type: error?.error?.name,
        message: error?.responseMessage,
      },
    }));
  }
};
