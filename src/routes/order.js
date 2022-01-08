import express from 'express';

import controllers from '../app/controllers/OrderController.js';

const router = express.Router();

router.get('/list/:username', controllers.index);
router.get('/detail/:orderId', controllers.show);
router.post('/update', controllers.updateOrderStatus)

// router.get('/:id/edit', controllers.edit);
// router.patch('/:id', controllers.update);
// router.delete('/:id', controllers.softDelete);
// router.delete('/:id/force', controllers.deepDelete);
// router.patch('/:id/restore', controllers.restore);

export default router;