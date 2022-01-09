import express from 'express';

import controllers from '../app/controllers/OrderController.js';

const router = express.Router();

router.get('/list/:username', controllers.index);
router.get('/trash_list/:username', controllers.indexTrash);
router.get('/detail/:orderId', controllers.show);
router.post('/update', controllers.updateOrderStatus)

router.delete('/:id', controllers.softDelete);
router.delete('/:id/force', controllers.deepDelete);
router.patch('/:id/restore', controllers.restore);

export default router;