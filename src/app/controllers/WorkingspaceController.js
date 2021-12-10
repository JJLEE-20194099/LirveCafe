import Book from '../models/Book.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Orders from '../models/Orders.js';
import User from '../models/User.js';
import Promo from '../models/Promo.js';

import Rank from '../constants/user.rank.js';

import Comment from '../models/Comment.js';
import Reply from '../models/Reply.js';


import {
    singleMongooseDocumentToObject,
    mongooseDocumentsToObject
} from '../../support_lib/mongoose.js';

const WorkingspaceController = {
    // GET /workingspace/index
    index(req, res, next) {
        res.render('workingspace/index.hbs')
    }


};

export default WorkingspaceController;