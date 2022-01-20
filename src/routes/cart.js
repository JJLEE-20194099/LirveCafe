import express from 'express';

import controllers from '../app/controllers/CartController.js';
import authMiddleware from '../app/middleware/AuthMiddleware.js';

const router = express.Router();

router.get('/show/:username', authMiddleware.requireAuth, authMiddleware.getCurrentUserInfo, controllers.showCart)
router.post('/add-book-to-cart', authMiddleware.requireAuth,controllers.addBookToCart)
router.post('/add-food-to-cart', authMiddleware.requireAuth,controllers.addFoodToCart)
router.post('/add-coffee-to-cart', authMiddleware.requireAuth,controllers.addCoffeeToCart)
router.post('/add-by-one', authMiddleware.requireAuth,controllers.addByOne)
router.post('/subtract-by-one', authMiddleware.requireAuth,controllers.subtractByOne)

router.post('/add-promo-to-cart', authMiddleware.requireAuth,controllers.addPromoToCart)

router.get('/buy/:id', authMiddleware.requireAuth,controllers.showPayForm)
router.get('/buys/:id', authMiddleware.requireAuth,controllers.showAllCartPayForm)
router.post('/buys', authMiddleware.requireAuth,controllers.buyAllCart)



export default router;