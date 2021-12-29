import express from 'express';

import controllers from '../app/controllers/CartController.js';
import authMiddleware from '../app/middleware/AuthMiddleware.js';

const router = express.Router();

router.get('/show/:username', authMiddleware.requireAuth, authMiddleware.getCurrentUserInfo, controllers.showCart)
router.post('/add-book-to-cart', controllers.addBookToCart)
router.post('/add-food-to-cart', controllers.addFoodToCart)
router.post('/add-coffee-to-cart', controllers.addCoffeeToCart)
router.post('/add-by-one', controllers.addByOne)
router.post('/subtract-by-one', controllers.subtractByOne)

router.post('/add-promo-to-cart', controllers.addPromoToCart)

router.get('/buy/:id', controllers.showPayForm)
router.get('/buys/:id', controllers.showAllCartPayForm)
router.post('/buys', controllers.buyAllCart)



export default router;