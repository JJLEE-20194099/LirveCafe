import express from 'express';
const router = express.Router();

import workingspaceController from '../app/controllers/WorkingspaceController.js';

router.get('/index', workingspaceController.index);

export default router;