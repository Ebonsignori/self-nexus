import express from 'express';
import authRoutes from './auth/authRoutes';
import errorHandlerMiddleware from '../lib/rest/errorHandlerMiddleware';
import loggingMiddleware from '../lib/rest/loggingMiddleware';

const router = express.Router();

// - - - - - -
// Rest Route Middleware
// - - - - - -
router.use(loggingMiddleware);
router.use(express.json());

// - - - - - -
// Rest Routes
// - - - - - -
router.use('/rest', authRoutes);

// - - - - - -
// Rest Route Custom Error Handler
// Make sure to pass async errors to next function, e.g. `return next(new ErrorType(error, 'Custom error msg'))`
// - - - - - -
router.use(errorHandlerMiddleware);

export default router;
