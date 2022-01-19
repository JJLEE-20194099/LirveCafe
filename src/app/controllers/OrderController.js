import Orders from '../models/Orders.js';
import Promo from '../models/Promo.js'
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
        Promise.all([Orders.find({username: username}), Orders.countDocumentsDeleted({username: username})])
            .then(([orders, deletedCount]) => {
                
                res.render('orders/list/store.hbs', {
                    orders: mongooseDocumentsToObject(orders),
                    user: res.locals.user,
                    cart: res.locals.cart,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis),
                    deletedCount
                });
            }).catch(next);
    },

    // GET orders/trash_list/:username

    indexTrash(req, res, next) {
        Orders.findDeleted({
            username: res.locals.user.username
        })
        .then((orders) => {
            res.render('orders/list/trash.hbs', {
                orders: mongooseDocumentsToObject(orders),
                user: res.locals.user,
                notis: res.locals.notis,
                no_new_notis: getNoNewNotis(res.locals.notis)
            })
        }).catch(next);
    },

    
    // GET /orders/detail/:orderId
    show(req, res, next) {
        const orderId = req.params.orderId;
        var order;
        var promo = null;
        Orders.findOne({_id: orderId})
            .then((o) => {
                
                order = singleMongooseDocumentToObject(o);
                console.log(order)
                if (order.promoId)
                    return Promo.findById(order.promoId)
                else return  Promo.findById(null)               
            }).then((p) => {
                if(p) {
                    promo = singleMongooseDocumentToObject(p)
                }
                res.render("orders/item/order_info.hbs", {
                    order: order,
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis),
                    promo: promo,
                })
            }).catch(next)
    },

    // POST orders/update?itemId=
    updateOrderStatus(req, res, next) {
        const itemIdQuery = req.query.itemId;
        const item_id_arr = itemIdQuery.split("-")
        const itemId = item_id_arr[1]
        const orderId = item_id_arr[0]
        var updatedOrder;
        var item;
        Orders.findOne({_id: orderId})
            .then((order) => {
                order = singleMongooseDocumentToObject(order)
                updatedOrder = order
            
                const itemList = order.itemList
                for (var i = 0; i < itemList.length; i++) {
                    if (itemList[i].food) {
                        if (itemList[i].food._id.toString() == itemId) {
                            updatedOrder.itemList[i].status = 1
                            item = updatedOrder.itemList[i]
                        }
                    } else if (itemList[i].coffee) {
                        if (itemList[i].coffee._id.toString() == itemId) {
                            updatedOrder.itemList[i].status = 1
                            item = updatedOrder.itemList[i]
                        }
                    } else if (itemList[i].book) {
                        if (itemList[i].book._id.toString() == itemId) {
                            updatedOrder.itemList[i].status = 1
                            item = updatedOrder.itemList[i]
                        }
                    }
                }
                // console.log("PromoId: ", updatedOrder.promoId)
                if (updatedOrder.promoId)
                    return Promise.all([Orders.updateOne({_id: orderId}, updatedOrder), Promo.findById(updatedOrder.promoId)])
                else return Promise.all([Orders.updateOne({_id: orderId}, updatedOrder), Promo.findById(null)])
               
            }).then(([_, promo]) => {
                if(promo) {
                    promo = singleMongooseDocumentToObject(promo)
                }
                res.render("orders/item/each_order_info.hbs", {item: item, order: updatedOrder, promo: promo})
            }).catch(next)

    },

    // GET /orders/item?itemId=

    getEachItemInOrders(req, res, next) {
        const itemIdQuery = req.query.itemId;
        const item_id_arr = itemIdQuery.split("-")
        const itemId = item_id_arr[1]
        const orderId = item_id_arr[0]
        var all_orders;
        var item;
        Orders.findOne({_id: orderId})
            .then((order) => {
                order = singleMongooseDocumentToObject(order)
                all_orders = order;
        
                const itemList = order.itemList
                for (var i = 0; i < itemList.length; i++) {
                    if (itemList[i].food) {
                        if (itemList[i].food._id.toString() == itemId) {
                            item = order.itemList[i]
                        }
                    } else if (itemList[i].coffee) {
                        if (itemList[i].coffee._id.toString() == itemId) {
                            item = order.itemList[i]
                        }
                    } else if (itemList[i].book) {
                        if (itemList[i].book._id.toString() == itemId) {
                            item = order.itemList[i]
                        }
                    }
                }
                
                if (all_orders.promoId)
                    return Promise.all([Promo.findById(updatedOrder.promoId)])
                else return Promise.all([Promo.findById(null)])
                
               
            }).then(([_, promo]) => {
                if(promo) {
                    promo = singleMongooseDocumentToObject(promo)
                }
                res.render("orders/item/each_order_info.hbs", {item: item, order: all_orders, promo: promo})
            }).catch(next)
    },

    // SOFT DELETE /orders/:id
    softDelete(req, res, next) {
        Orders.delete({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // DEEP DELETE /orders/:id/force
    deepDelete(req, res, next) {
        Orders.deleteOne({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // RESTORE BOOK (PATCH) /orders/:id/restore
    restore(req, res, next) {
        Orders.restore({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },
}

export default OrderController;