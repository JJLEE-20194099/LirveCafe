import express from 'express';
const router = express.Router();

import homeController from '../app/controllers/HomeController.js';

router.get('/', homeController.index);
router.get('/getSuggest', homeController.suggestIndex);

export default router;