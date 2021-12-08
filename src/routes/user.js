import express from 'express';
import controllers from '../app/controllers/UserController.js';
import ownControllers from '../app/controllers/OwnController.js';
import multer from 'multer';
import path from 'path';

import validate from '../app/validate/user.validate.js';

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

const router = express.Router();

router.get('/list', controllers.index);
router.get('/create', controllers.create);
router.get('/:id', controllers.show);
router.post('/save', 
    upload.single('avatar'),
    validate.postSignup,
    controllers.save,
);
router.get('/:id/edit', controllers.edit);
router.put('/:id', controllers.update);
router.patch('/:id/restore', controllers.restore);
router.delete('/:id', controllers.softDelete);
router.delete('/:id/force', controllers.deepDelete);

router.get('/stored/events', ownControllers.storedEvents);
router.get('/trash/events', ownControllers.trashEvents);

router.get('/stored/Orders', ownControllers.storedOrders);
router.get('/trash/Orders', ownControllers.trashOrders);



export default router;
