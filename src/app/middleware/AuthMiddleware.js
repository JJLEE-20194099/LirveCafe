import User from '../models/User.js';
import Cart from '../models/Cart.js';

import {
    singleMongooseDocumentToObject,
    mongooseDocumentsToObject
} from '../../support_lib/mongoose.js';

const AuthMiddleware = {
    requireAuth: function (req, res, next) {
        
        if (Object.keys(req.signedCookies).length.toString() == Number(0).toString()) {
            res.redirect('/auth/index');
            return;
        }



        User.findOne({
                _id: req.signedCookies.userId
            })
            .then((user) => {

                if (!user) {
                    res.redirect('/auth/index');
                    return;
                }
                user = singleMongooseDocumentToObject(user);
        
                next();
            })
    },
    getCurrentUserInfo: function (req, res, next) {
        if (req.signedCookies.userId) {
            User.findOne({
                    _id: req.signedCookies.userId
                })
                .then(user => {
                    if (user) {


                        res.locals.user = singleMongooseDocumentToObject(user)
                        
                        return Cart.findOne({
                            username: res.locals.user.username
                        })
                    } else {

                        next();
                    }

                }).then((cart) => {
                    if (cart) {
                        res.locals.cart = singleMongooseDocumentToObject(cart);
                        
                    }
                    next();
                })

        } else {
            next();
        }

    }
}

export default AuthMiddleware;