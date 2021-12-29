import Book from '../models/Book.js';
import Cart from '../models/Cart.js';
import Promo from '../models/Promo.js';
import User from '../models/User.js';

import {
    singleMongooseDocumentToObject,
    mongooseDocumentsToObject
} from '../../support_lib/mongoose.js';

import {
    getNoNewNotis
} from '../../support_lib/noti.js'

const CartController = {


    addBookToCart(req, res, next) {

        const itemId = req.body.itemId;
        const username = req.body.username;
        var userCart = [];
        var data = {};
        Promise.all([Cart.findOne({
                username: username
            }), Book.findOne({
                _id: itemId
            }), User.findOne({
                username: username
            })])
            .then(([cart, book, user]) => {
                user = singleMongooseDocumentToObject(user)
                if (!cart) {
                    userCart.push({
                        book: singleMongooseDocumentToObject(book),
                        quantity: 1
                    })
                    data = {
                        username: username,
                        itemList: userCart,
                        level: user.registered_level,
                        activating: user.activating_loyalty

                    }

                    cart = new Cart(data);

                    return cart.save(data)
                } else {
                    cart = singleMongooseDocumentToObject(cart);
                    userCart = cart.itemList;
                    var flag = false;
                    for (var i = 0; i < userCart.length; i++) {

                        if (userCart[i].book._id.toString() === itemId) {
                            userCart[i].quantity = userCart[i].quantity + 1;
                            flag = true;
                            break;
                        }
                    }

                    data = {
                        username: username,
                        itemList: userCart,
                        level: user.registered_level,
                        activating: user.activating_loyalty
                    }


                    if (!flag) {
                        userCart.push({
                            book: singleMongooseDocumentToObject(book),
                            quantity: 1
                        })
                    }

                    return Cart.updateOne({
                        username: username
                    }, {
                        itemList: userCart
                    })
                }
            }).then(() => {
                res.send(data)
            }).catch(next)

    },

    showCart(req, res, next) {

        const username = req.params.username;
        let level = parseInt(req.query.level)
        let activating = 0
        if (req.query.activating) {
            activating = parseInt(req.query.activating)
        }
        level = level || 0
        var total = 0

        if (activating == 0) level = 0

        Cart.findOne({
                username: username
            })
            .then((cart) => {
                cart = singleMongooseDocumentToObject(cart)
                console.log(cart)
                if (!cart) cart = {
                    username: username,
                    itemList: []
                }
                total = cart.itemList.reduce(function (acc, item) {
                    let price = item.book.price
                    if (price.includes("$"))
                        price = price.slice(1)
                    return acc + parseFloat(price) * parseInt(item.quantity)
                }, 0)

                console.log(total)

                return Promise.all([Promo.find({
                    condition: {
                        $lte: total
                    }
                }), Cart.findOne({
                    username: username
                })])
            })
            .then(([promoList, cart]) => {
                if (!promoList) promoList = []
                else {
                    promoList = mongooseDocumentsToObject(promoList)
                    promoList.sort(function (a, b) {
                        if (!a.discountAmount)
                            a.disCountAmount = 0;
                        if (!b.disCountAmount)
                            b.disCountAmount = 0;

                        if (!a.discountPercentage)
                            a.disCountPercentage = 0;
                        if (!b.disCountPercentage)
                            b.disCountPercentage = 0;

                        if (a.discountAmount && b.discountAmount) {
                            if (a.discountAmount == b.discountAmount)
                                return b.condition - a.condition
                            return a.discountAmount - b.discountAmount
                        }

                        if (a.discountPercentage && b.discountPercentage) {
                            if (a.discountPercentage == b.discountPercentage)
                                return b.condition - a.condition
                            return a.discountPercentage - b.discountPercentage
                        }

                        if (a.discountPercentage && b.discountAmount)
                            return 1;



                        return -1;


                    })

                    const limitPromo = parseInt(level * promoList.length / 6)

                    promoList = promoList.slice(0, limitPromo)
                }




                cart = singleMongooseDocumentToObject(cart)
                res.render('carts/index.hbs', {
                    cart,
                    total: total,
                    promoList,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            })
    },

    addByOne(req, res, next) {
        const data = req.body;
        let userCart = []
        Cart.findOne({
                username: data.username
            })
            .then((cart) => {
                cart = singleMongooseDocumentToObject(cart)
                userCart = cart.itemList;
                for (var item of userCart) {
                    if (item.book._id.toString() === data.bookId) {
                        item.quantity += 1
                    }
                }
                return Cart.updateOne({
                    username: data.username
                }, {
                    itemList: userCart
                })
            }).then(() => {
                res.locals.cart = userCart;

                res.send(userCart)
            })
            .catch(next)
    },

    subtractByOne(req, res, next) {
        const data = req.body;
        let userCart = []
        Cart.findOne({
                username: data.username
            })
            .then((cart) => {
                cart = singleMongooseDocumentToObject(cart)
                userCart = cart.itemList;

                for (var i = 0; i < userCart.length; i++) {
                    var item = userCart[i];
                    if (item.book._id.toString() === data.bookId) {
                        item.quantity -= 1
                    }
                    if (item.quantity == 0) userCart.splice(i, 1);
                }

                return Cart.updateOne({
                    username: data.username
                }, {
                    itemList: userCart
                })
            }).then(() => {
                res.locals.cart = userCart;

                res.send({
                    itemList: userCart
                })
            })
            .catch(next)
    },

    addPromoToCart(req, res, next) {

        const data = req.body;
        Promise.all([
            Cart.findOne({
                _id: data.cartId
            }),
            Promo.findOne({
                _id: data.promoId
            }),

        ]).then(([cart, promo]) => {

        }).catch(next)
    },

    finishCart(req, res, next) {
        
        const itemList = req.body.itemList;

        var userCart = [];
        var data = {};
        console.log(itemList)
    }


}

export default CartController;