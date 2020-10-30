import express from 'express';
import usersController from './users/usersController';

const router = express.Router();

// 3rd party video service hits our api at POST v3/mams to send us video data (like video url, name, etc)
router.use('/users', usersController);

export default router;
