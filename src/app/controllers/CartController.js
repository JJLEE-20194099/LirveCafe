import Book from '../models/Book.js';
import Food from '../models/Food.js';
import Coffee from '../models/Coffee.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Orders from '../models/Orders.js';
import User from '../models/User.js';
import Promo from '../models/Promo.js';

import Rank from '../constants/user.rank.js';

import Comment from '../models/Comment.js';
import Reply from '../models/Reply.js';

import emailController from './EmailController.js';

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

                       if (userCart[i].book) {
                        if (userCart[i].book._id.toString() === itemId) {
                            userCart[i].quantity = userCart[i].quantity + 1;
                            flag = true;
                            break;
                        }
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

    addFoodToCart(req, res, next) {

        const itemId = req.body.itemId;
        const username = req.body.username;
        var userCart = [];
        var data = {};
        Promise.all([Cart.findOne({
                username: username
            }), Food.findOne({
                _id: itemId
            }), User.findOne({
                username: username
            })])
            .then(([cart, food, user]) => {
                user = singleMongooseDocumentToObject(user)
               
                if (!cart) {
                    userCart.push({
                        food: singleMongooseDocumentToObject(food),
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

                        if (userCart[i].food) {
                            if (userCart[i].food._id.toString() === itemId) {
                                userCart[i].quantity = userCart[i].quantity + 1;
                                flag = true;
                                break;
                            }
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
                            food: singleMongooseDocumentToObject(food),
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

    addCoffeeToCart(req, res, next) {

        const itemId = req.body.itemId;
        const username = req.body.username;
        var userCart = [];
        var data = {};
        Promise.all([Cart.findOne({
                username: username
            }), Coffee.findOne({
                _id: itemId
            }), User.findOne({
                username: username
            })])
            .then(([cart, coffee, user]) => {
                user = singleMongooseDocumentToObject(user)
               
                if (!cart) {
                    userCart.push({
                        coffee: singleMongooseDocumentToObject(coffee),
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

                        if (userCart[i].coffee) {
                            if (userCart[i].coffee._id.toString() === itemId) {
                                userCart[i].quantity = userCart[i].quantity + 1;
                                flag = true;
                                break;
                            }
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
                            coffee: singleMongooseDocumentToObject(coffee),
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
                    let price = 0
                    if (item.book) {
                        price = item.book.price
                        if (price.includes("đ"))
                            price = price.slice(1)
                    } else if (item.food) {
                        price = item.food.price
                        if (price.includes("đ"))
                            price = price.slice(1)
                    } else if (item.coffee) {
                        price = item.coffee.price
                        if (price.includes("đ"))
                            price = price.slice(1)
                    }
                    
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
                    if (item.book) {
                        if (item.book._id.toString() === data.bookId) {
                            item.quantity += 1
                        }
                    } else if (item.coffee) {
                        if (item.coffee._id.toString() === data.bookId) {
                            item.quantity += 1
                        }
                    } else if (item.food) {
                        if (item.food._id.toString() === data.bookId) {
                            item.quantity += 1
                        }
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
                    if (item.book) {
                        if (item.book._id.toString() === data.bookId) {
                            item.quantity -= 1
                        }
                        if (item.quantity == 0) userCart.splice(i, 1);
                    } else if (item.food) {
                        if (item.food._id.toString() === data.bookId) {
                            item.quantity -= 1
                        }
                        if (item.quantity == 0) userCart.splice(i, 1);
                    } else if (item.coffee) {
                        if (item.coffee._id.toString() === data.bookId) {
                            item.quantity -= 1
                        }
                        if (item.quantity == 0) userCart.splice(i, 1);
                    }
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
    },

    
    // GET: /carts/buy/:id
    showPayForm(req, res, next) {

        Book.findOne({
                _id: req.params.id
            })
            .then((book) => {
                book = singleMongooseDocumentToObject(book)
                res.render('buy/buyOneItem.hbs', {
                    book: book,
                    user: res.locals.user,
                    cart: res.locals.cart,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            })
    },

    // GET: /carts/buys/:id
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
                    else return 0
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

    // POST: /carts/buys

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



}

export default CartController;