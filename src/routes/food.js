import express from 'express';
const router = express.Router();

import multer from 'multer';
import path from 'path';

import controllers from '../app/controllers/FoodController.js';
import commentControllers from '../app/controllers/CommentController.js';
import notificationController from '../app/controllers/NotificationController.js';

import validate from '../app/validate/coffee.validate.js';
import checkUser from '../app/middleware/AuthMiddleware.js'

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "src/public/uploads/img");
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + ".jpg")
    }
})

const maxSize = 1 * 1000 * 1000 * 1000 * 1000 * 1000;
var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize},
    fileFilter: function(req, file, cb) {
        var filetypes = /jpeg|jpg|png|gif/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: File upload only supports the following filetypes - " + filetypes);
    }
})

router.get('/list', controllers.index);
router.get('/create', controllers.create);
router.get('/buy/:id', controllers.showPayForm)
router.post('/buy', controllers.buy)
router.get('/:slug', controllers.show);
router.post('/save',  
    upload.single('image'),
    validate.postCreateCoffee,
    controllers.save
);
router.get('/:id/edit', controllers.edit);
router.patch('/:id', controllers.update);
router.delete('/:id', controllers.softDelete);
router.delete('/:id/force', controllers.deepDelete);
router.patch('/:id/restore', controllers.restore);

router.post('/do-comment', commentControllers.doComment)
router.post('/reply-comment', commentControllers.replyComment)

router.post('/get-comment-notification', notificationController.getCommentNotification)


export default router;