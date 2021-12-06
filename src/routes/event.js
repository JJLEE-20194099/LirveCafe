import express from 'express';
const router = express.Router();

import controllers from '../app/controllers/EventController.js';

router.get('/list', controllers.index);
router.get('/create', controllers.create);
router.get('/:slug', controllers.show);
router.post('/save', controllers.save);
router.get('/:id/edit', controllers.edit);
router.patch('/:id', controllers.update);
router.delete('/:id', controllers.softDelete);
router.delete('/:id/force', controllers.deepDelete);
router.patch('/:id/restore', controllers.restore);

export default router;