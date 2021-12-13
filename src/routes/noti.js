import express from 'express';
const router = express.Router();

import controllers from '../app/controllers/NotificationController.js';

router.get('/:username', controllers.getNotisByUser)

export default router;