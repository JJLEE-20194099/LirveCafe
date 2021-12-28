import Orders from '../models/Orders.js';

import { 
    singleMongooseDocumentToObject,
    mongooseDocumentsToObject 
} from '../../support_lib/mongoose.js';

import {
    getNoNewNotis
} from '../../support_lib/noti.js'


const OrderController = {

    // GET /orders/list/:username

    index(req, res, next) {
        const username = req.params.username;
        Orders.find({username: username})
            .then((orders) => {
                
                res.render('orders/list/list.hbs', {
                    orders: mongooseDocumentsToObject(orders),
                    user: res.locals.user,
                    cart: res.locals.cart,
                    notis: res.locals.notis,
                        no_new_notis: getNoNewNotis(res.locals.notis)
                });
            }).catch(next);
    },

    
    // GET /orders/detail/:orderId
    show(req, res, next) {
        const orderId = req.params.orderId;
        
        Orders.findOne({_id: orderId})
            .then((order) => {
                
                order = singleMongooseDocumentToObject(order);
               
                res.render("orders/item/order_info.hbs", {
                    order: order,
                    user: res.locals.user,
                    notis: res.locals.notis,
                        no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next)
    },
}

export default OrderController;