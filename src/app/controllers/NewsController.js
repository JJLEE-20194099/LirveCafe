import News from '../models/News.js'
import Book from '../models/Book.js';
import Coffee from '../models/Coffee.js';
import Food from '../models/Food.js';
import User from '../models/User.js';
import {
    singleMongooseDocumentToObject,
    mongooseDocumentsToObject
} from '../../support_lib/mongoose.js';

import {
    getUpdateSaleoffPromises
} from '../../support_lib/news.js';

import {
    mergeNewsAndProduct
} from '../../support_lib/news.js';

const NewsController = {

    // GET /news/list
    index(req, res, next) {
        News.find({})
            .then((news) => {
                res.render('news/list/list.hbs', {
                    news: mongooseDocumentsToObject(news),
                    user: res.locals.user
                });
            }).catch(next);
    },

    // GET: /news/:slug
    show(req, res, next) {
        News.findOne({
                slug: req.params.slug
            })
            .then((book) => {
                res.render('news/item/news_info.hbs', {
                    book: singleMongooseDocumentToObject(book),
                    user: res.locals.user
                })
            })
            .catch(next);
    },

    // GET: /news/create
    create(req, res, next) {
        res.render('own/news/item/create.hbs', {
            user: res.locals.user
        });
    },

    // POST : /news/save
    save(req, res, next) {
        req.body.image = '/' + req.file.path.split('\\').slice(2).join('/');
        const news = new News(req.body);
        news.save()
            .then(() => {
                return Promise.all([Book.find({}), Coffee.find({}), Food.find({}), User.findOne({
                    _id: req.signedCookies.userId
                }), News.find({
                    applicableObject: 0
                }), News.find({
                    applicableObject: 1
                }), News.find({
                    applicableObject: 2
                })])
            }).then(([books, coffee, food, user, bookNews, coffeeNews, foodNews]) => {
                books = mongooseDocumentsToObject(books)
                coffee = mongooseDocumentsToObject(coffee)
                food = mongooseDocumentsToObject(food)
                let new_products;
                if (req.body.applicableObject == 0) {
                    if (bookNews) {
                        bookNews = mongooseDocumentsToObject(bookNews)
                        new_products = mergeNewsAndProduct(books, bookNews)
                        books = new_products[0]
                    }
                } else if (req.body.applicableObject == 1) {
                    if (coffeeNews) {
                        coffeeNews = mongooseDocumentsToObject(coffeeNews)
                        new_products = mergeNewsAndProduct(coffee, coffeeNews)
                        coffee = new_products[0]
                    }
                } else if (req.body.applicableObject == 2) {

                    if (foodNews) {
                        foodNews = mongooseDocumentsToObject(foodNews)
                        new_products = mergeNewsAndProduct(food, foodNews)
                        food = new_products[0]
                    }
                }
                const updateSaleoffPromises = getUpdateSaleoffPromises(books, coffee, food)
                return Promise.all(updateSaleoffPromises.map(promise => promise()))

            })
            .then((_) => {
                res.send({status: "success"})
            })
            .catch(next);
    },

    // [GET] /news/:id/edit
    edit(req, res, next) {
        News.findById(req.params.id)
            .then((news) => {
                res.render('news/edit', {
                    news: singleMongooseDocumentToObject(news),
                    user: res.locals.user
                })
            })
            .catch(next);
    },

    // PUT /news/:id
    update(req, res, next) {
        News.updateOne({
                _id: req.params.id
            }, req.body)
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // SOFT DELETE /news/:id
    softDelete(req, res, next) {
        News.delete({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // DEEP DELETE /news/:id/force
    deepDelete(req, res, next) {
        News.deleteOne({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // RESTORE News (PATCH) /news/:id/restore
    restore(req, res, next) {
        News.restore({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    }
};

export default NewsController;