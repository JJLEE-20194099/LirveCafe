import express from 'express';

import controllers from '../app/controllers/CartController.js';
import authMiddleware from '../app/middleware/AuthMiddleware.js';

const router = express.Router();

router.get('/show/:username', authMiddleware.requireAuth, authMiddleware.getCurrentUserInfo, controllers.showCart)
router.post('/add-book-to-cart', controllers.addBookToCart)
router.post('/add-by-one', controllers.addByOne)
router.post('/subtract-by-one', controllers.subtractByOne)

router.post('/add-promo-to-cart', controllers.addPromoToCart)



export default router;