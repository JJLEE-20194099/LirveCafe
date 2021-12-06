import express from 'express';
const router = express.Router();

import controllers from '../app/controllers/NotificationController.js';

router.get('/list', controllers.index);

export default router;