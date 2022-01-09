import express from 'express';
const router = express.Router();

import controllers from '../app/controllers/NotificationController.js';

router.get('/list/:username', controllers.getNotisByUser)
router.get('/trash_list/:username', controllers.getNotisTrashByUser)
router.post('/index/:id', controllers.getNotiById)

router.delete('/:id', controllers.softDelete);
router.delete('/:id/force', controllers.deepDelete);
router.patch('/:id/restore', controllers.restore);

export default router;