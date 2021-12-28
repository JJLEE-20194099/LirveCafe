import express from 'express';
const router = express.Router();

import controllers from '../app/controllers/NotificationController.js';

router.get('/:username', controllers.getNotisByUser)
router.post('/index/:id', controllers.getNotiById)

export default router;