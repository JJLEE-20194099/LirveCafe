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
   cal_avg_rating
} from '../../support_lib/rating.js';

import emailController from './EmailController.js';

import {
    getNoNewNotis
} from '../../support_lib/noti.js'

import {
    calculateRemainingCart
} from '../../support_lib/cart.js'

import {
    mergeNewsAndProduct
} from '../../support_lib/news.js';


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


const BookController = {
    // GET /books/list
    index(req, res, next) {
        const enabled = res.locals.sort.enabled;
        const field = res.locals.sort.field;
        var type;
        
        if (res.locals.sort.type == 'desc') {
            type = -1
        } else type = 1
        

        if (field == 'price') {
            
            Book.find().sort({price: parseInt(type)})
            .then((books) => {
                res.render('books/list/list.hbs', {
                    books: mongooseDocumentsToObject(books),
                    user: res.locals.user,
                    cart: res.locals.cart,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                });
            }).catch(next);
        } else if (field == 'newest') {
            Book.find().sort({createdAt: 1})
            .then((books) => {
                res.render('books/list/list.hbs', {
                    books: mongooseDocumentsToObject(books),
                    user: res.locals.user,
                    cart: res.locals.cart,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                });
            }).catch(next);
        } else {
            Book.find().sort({no_sold: -1})
            .then((books) => {
                res.render('books/list/list.hbs', {
                    books: mongooseDocumentsToObject(books),
                    user: res.locals.user,
                    cart: res.locals.cart,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                });
            }).catch(next);
        }


        
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
                            no_new_notis: getNoNewNotis(res.locals.notis),
                            avg_rating: cal_avg_rating(commentList)
                        })
                    })

            })
            .catch(next);
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

        var image = ''

        Book.findOne({
                _id: req.params.id
            })
            .then((book) => {
                book = singleMongooseDocumentToObject(book)
                image = book.image
                if (req && req.file && req.file.path) {
                    image = '/' + req.file.path.split('\\').slice(2).join('/');
                }
                req.body.image = image;
                return Book.updateOne({
                    _id: req.params.id
                }, req.body)
            }).then(() => res.redirect('back'))
            .catch(next);
    },

    // POST /books/update_saleoff_status

    updateSaleoffStatus(req, res, next) {
        Book.find({saleoff_status: 1})
            .then((books) => {
                if (books)
                    books = mongooseDocumentsToObject(books)
                const updatePromises = [];
                for(let book of books) {
                    book.quantity = book.quantity + book.sum_items_during_saleoff
                    book.no_sold = book.no_sold + book.no_sold_during_saleoff
                    delete book.no_sold_during_saleoff
                    delete book.saleoff_status
                    delete book.discountPercentage
                    delete book.saleoff_price
                    delete book.sum_items_during_saleoff
                    updatePromises.push(() => Book.updateOne({_id: book._id}, book))
                }
                return Promise.all(updatePromises.map(promise => promise()))
            })
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