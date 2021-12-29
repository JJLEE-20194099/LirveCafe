import Food from '../models/Coffee.js';
import Coffee from '../models/Coffee.js';
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


import emailController from './EmailController.js';

import {
    getNoNewNotis
} from '../../support_lib/noti.js'

import {
    calculateRemainingCart
} from '../../support_lib/cart.js'


const calculateUserLevel = ([multiOrderList, user]) => {

    if (!multiOrderList)
        multiOrderList = []
    else multiOrderList = mongooseDocumentsToObject(multiOrderList)

    var total = multiOrderList.reduce(function (acc, item) {
        return acc + item.total
    }, 0)

    var level = 0;
    for (var i = Rank.totalAmountPurchased.length - 1; i >= 0; i--) {
        if (total >= Rank.totalAmountPurchased[i] * 1000) {
            level = i + 1;
            break;
        }
    }

    user.level = level;
    return user.save()

}


const CoffeeController = {
    // GET /coffee/list
    index(req, res, next) {
        Coffee.find({})
            .then((coffee) => {
                res.render('drink/list/list.hbs', {
                    coffee: mongooseDocumentsToObject(coffee),
                    user: res.locals.user,
                    cart: res.locals.cart,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                });
            }).catch(next);
    },

    // GET: /coffee/:slug
    show(req, res, next) {
        Promise.all([Coffee.findOne({
                slug: req.params.slug
            }), Coffee.find({})])
            .then(([coffee, coffees]) => {
                coffees = mongooseDocumentsToObject(coffees)
                coffee = singleMongooseDocumentToObject(coffee)
                Comment.find({
                        itemId: coffee._id
                    })
                    .sort({
                        updatedAt: -1
                    })
                    .then((commentList) => {
                        res.render('drink/item/coffee_info.hbs', {
                            coffee: coffee,
                            commentList: mongooseDocumentsToObject(commentList),
                            coffees: coffees,
                            user: res.locals.user,
                            cart: res.locals.cart,
                            notis: res.locals.notis,
                            no_new_notis: getNoNewNotis(res.locals.notis)
                        })
                    })

            })
            .catch(next);
    },

    // GET: /coffee/buy/:id
    showPayForm(req, res, next) {

        Coffee.findOne({
                _id: req.params.id
            })
            .then((coffee) => {
                coffee = singleMongooseDocumentToObject(coffee)
                res.render('buy/buyOneItem.hbs', {
                    coffee: coffee,
                    user: res.locals.user,
                    cart: res.locals.cart,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            })
    },

    // GET: /coffee/buys/:id
    showAllCartPayForm(req, res, next) {
        const promoId = req.query.promoId


        Promise.all([Cart.findOne({
                _id: req.params.id
            }), Promo.findOne({
                _id: promoId
            })])
            .then(([cart, promo]) => {
                cart = singleMongooseDocumentToObject(cart)
                promo =  singleMongooseDocumentToObject(promo)
                var total = cart.itemList.reduce(function (acc, item) {
                    if (item.book)
                        return acc + parseInt(item.book.price) * parseInt(item.quantity)
                    else if (item.food)
                        return acc + parseInt(item.food.price) * parseInt(item.quantity)
                    else if (item.coffee)
                        return acc + parseInt(item.coffee.price) * parseInt(item.quantity)
                    
                }, 0)
                var new_total = total
               if (promo) {
                if (promo.discountAmount) {

                    new_total = new_total - parseInt(promo.discountAmount) * 1000
                    
                }
                else {
                    new_total = new_total - (new_total) * parseInt(promo.discountPercentage) / 100
                    
                }
               }
           


                res.render('buy/buyAllCart.hbs', {
                    cart: cart,
                    user: res.locals.user,
                    total: total,
                    promo: promo,
                    new_total: new_total,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            })


    },

    // POST: /coffee/buys

    buyAllCart(req, res, next) {
        const data = req.body;
        const itemId = data.itemId;
        delete data.itemId;
        data.itemList = []
        var orders = new Orders(data);

        

        Cart.findOne({
                _id: itemId
            })
            .then((cart) => {

                data.itemList = singleMongooseDocumentToObject(cart).itemList;
                orders = new Orders(data);

                

                return Promise.all([orders.save(), Cart.deleteOne({
                    _id: itemId
                })])
            }).then(([x, y]) => {
                return Promise.all([
                    Orders.find({
                        username: data.username
                    }),
                    User.findOne({
                        username: data.username
                    }),
                ])
            }).then(([multiOrderList, user]) => {
                calculateUserLevel(([multiOrderList, user]))
            })
            .then(() => {
                emailController.sendOrderNotice(req, orders)
                    res.send("Ok")
            })
            .catch(next)
    },

    // GET: /coffee/create
    create(req, res, next) {
        res.render('own/drink/item/create.hbs', {
            user: res.locals.user
        });
    },

    // POST : /coffee/save
    save(req, res, next) {

        req.body.image = '/' + req.file.path.split('\\').slice(2).join('/');
        const coffee = new Food(req.body);
        coffee.save()
            .then(() => res.redirect('/own/stored/coffee'))
            .catch(next);
    },

    // [GET] /coffee/:id/edit
    edit(req, res, next) {
        Coffee.findById(req.params.id)
            .then((coffee) => {
                res.render('own/drink/item/edit.hbs', {
                    coffee: singleMongooseDocumentToObject(coffee),
                    user: res.locals.user,
                    cart: res.locals.cart,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            })
            .catch(next);
    },

    // PATCH /coffee/:id
    update(req, res, next) {
        Coffee.updateOne({
                _id: req.params.id
            }, req.body)
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // SOFT DELETE /coffee/:id
    softDelete(req, res, next) {
        Coffee.delete({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // DEEP DELETE /coffee/:id/force
    deepDelete(req, res, next) {
        Coffee.deleteOne({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // RESTORE FOOD (PATCH) /coffee/:id/restore
    restore(req, res, next) {
        Coffee.restore({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },
};

export default CoffeeController;