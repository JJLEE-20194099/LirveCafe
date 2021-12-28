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

import {
    getNoNewNotis
} from '../../support_lib/noti.js'


const calculateUserLevel = ([multiOrderList, user]) => {

    if (!multiOrderList)
        multiOrderList = []
    else multiOrderList = mongooseDocumentsToObject(multiOrderList)

    var total = multiOrderList.reduce(function (acc, item) {
        return acc + item.total
    }, 0)

    var level = 0;
    for (var i = Rank.totalAmountPurchased.length - 1; i >= 0; i--) {
        if (total >= Rank.totalAmountPurchased[i]) {
            level = i + 1;
            break;
        }
    }

    user.level = level;
    return user.save()

}


const BookController = {
    // GET /books/list
    index(req, res, next) {
        Book.find({})
            .then((books) => {
                res.render('books/list/list.hbs', {
                    books: mongooseDocumentsToObject(books),
                    user: res.locals.user,
                    cart: res.locals.cart,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                });
            }).catch(next);
    },

    // GET: /books/:slug
    show(req, res, next) {
        Promise.all([Book.findOne({
                slug: req.params.slug
            }), Book.find({})])
            .then(([book, books]) => {
                books = mongooseDocumentsToObject(books)
                book = singleMongooseDocumentToObject(book)
                Comment.find({
                        itemId: book._id
                    })
                    .sort({
                        updatedAt: -1
                    })
                    .then((commentList) => {
                        res.render('books/item/book_info.hbs', {
                            book: book,
                            commentList: mongooseDocumentsToObject(commentList),
                            books: books,
                            user: res.locals.user,
                            cart: res.locals.cart,
                            notis: res.locals.notis,
                            no_new_notis: getNoNewNotis(res.locals.notis)
                        })
                    })

            })
            .catch(next);
    },

    // GET: /books/buy/:id
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

    // GET: /books/buys/:id
    showAllCartPayForm(req, res, next) {
        const promoId = req.query.promoId


        Promise.all([Cart.findOne({
                _id: req.params.id
            }), Promo.findOne({
                _id: promoId
            })])
            .then(([cart, promo]) => {
                cart = singleMongooseDocumentToObject(cart)

                var total = cart.itemList.reduce(function (acc, item) {
                    return acc + parseInt(item.book.price) * parseInt(item.quantity);
                }, 0)
                res.render('buy/buyAllCart.hbs', {
                    cart: cart,
                    user: res.locals.user,
                    total: total,
                    promo: singleMongooseDocumentToObject(promo),
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            })


    },

    // POST: /books/buys

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
            .then(() => res.send("OK"))
            .catch(next)
    },

    // GET: /books/create
    create(req, res, next) {
        res.render('own/books/item/create.hbs', {
            user: res.locals.user
        });
    },

    // POST : /books/save
    save(req, res, next) {

        req.body.image = '/' + req.file.path.split('\\').slice(2).join('/');
        const book = new Book(req.body);
        book.save()
            .then(() => res.redirect('/own/stored/books'))
            .catch(next);
    },

    // [GET] /books/:id/edit
    edit(req, res, next) {
        Book.findById(req.params.id)
            .then((book) => {
                res.render('own/books/item/edit.hbs', {
                    book: singleMongooseDocumentToObject(book),
                    user: res.locals.user,
                    cart: res.locals.cart,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            })
            .catch(next);
    },

    // PATCH /books/:id
    update(req, res, next) {
        Book.updateOne({
                _id: req.params.id
            }, req.body)
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // SOFT DELETE /books/:id
    softDelete(req, res, next) {
        Book.delete({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // DEEP DELETE /books/:id/force
    deepDelete(req, res, next) {
        Book.deleteOne({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // RESTORE BOOK (PATCH) /books/:id/restore
    restore(req, res, next) {
        Book.restore({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },
};

export default BookController;