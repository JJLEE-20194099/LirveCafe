import User from '../models/User.js';
import Noti from '../models/Noti.js';

import {
    singleMongooseDocumentToObject,
    mongooseDocumentsToObject
} from '../../support_lib/mongoose.js';

const NotiMiddleware = {


    getNotiInfo: function (req, res, next) {
        if (req.signedCookies.userId) {
            User.findOne({
                    _id: req.signedCookies.userId
                })
                .then(user => {
                    
                    if (user) {
                        return Noti.find({
                            receiver: res.locals.user.username
                        }).sort({'createdAt': -1})
                    } else {

                        next();
                    }

                }).then((notis) => {
                    if (notis) {
                        res.locals.notis = mongooseDocumentsToObject(notis);
                    }
                    next();
                })

        } else {
            next();
        }

    }
}

export default NotiMiddleware;