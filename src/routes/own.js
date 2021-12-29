import express from 'express';
const router = express.Router();

import controllers from '../app/controllers/OwnController.js';

router.get('/stored/coffee', controllers.storedCoffee);
router.get('/stored/books', controllers.storedBooks);
router.get('/stored/users', controllers.storedUsers);
router.get('/stored/news', controllers.storedNews);
router.get('/stored/promos', controllers.storedPromos);
router.get('/stored/orders', controllers.storedOrders);
router.get('/stored/food', controllers.storedFood);
router.get('/stored/workingspaces', controllers.storedWorkingspaces);

router.get('/trash/coffee', controllers.trashCoffee);
router.get('/trash/books', controllers.trashBooks);
router.get('/trash/users', controllers.trashUsers);
router.get('/trash/news', controllers.trashNews);
router.get('/trash/promos', controllers.trashPromos);
router.get('/trash/food', controllers.trashFood);
router.get('/trash/orders', controllers.trashOrders);

export default router;