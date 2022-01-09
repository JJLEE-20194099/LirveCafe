import Coffee from '../models/Coffee.js';
import Book from '../models/Book.js';
import Food from '../models/Food.js';
import News from '../models/News.js';
import User from '../models/User.js';
import Workingspace from '../models/Workingspace.js';
import Promo from '../models/Promo.js';
import Orders from '../models/Orders.js';
import Noti from '../models/Noti.js';

import {
    mongooseDocumentsToObject
} from '../../support_lib/mongoose.js';

import {
    getNoNewNotis
} from '../../support_lib/noti.js'

const OwnController = {

    // 1. coffee warehouse

    // GET own/stored/coffee
    storedCoffee(req, res, next) {
        Promise.all([Coffee.find({}), Coffee.countDocumentsDeleted()])
            .then(([coffee, deletedCount]) => {
                res.render('own/drink/list/store.hbs', {
                    deletedCount,
                    coffee: mongooseDocumentsToObject(coffee),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    // GET own/trash/coffee
    trashCoffee(req, res, next) {
        Coffee.findDeleted({})
            .then((coffee) => {
                res.render('own/drink/list/trash.hbs', {
                    coffee: mongooseDocumentsToObject(coffee),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    // 2. book warehouse

    // GET own/stored/books
    storedBooks(req, res, next) {
        Promise.all([Book.find({}), Book.countDocumentsDeleted()])
            .then(([books, deletedCount]) => {
                res.render('own/books/list/store.hbs', {
                    deletedCount,
                    books: mongooseDocumentsToObject(books),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    // GET own/trash/books
    trashBooks(req, res, next) {
        Book.findDeleted({})
            .then((books) => {
                res.render('own/books/list/trash.hbs', {
                    books: mongooseDocumentsToObject(books),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    // 3. user

    // GET own/stored/users
    storedUsers(req, res, next) {
        Promise.all([User.find({}), User.countDocumentsDeleted()])
            .then(([users, deletedCount]) => {
                res.render('own/users/list/store.hbs', {
                    deletedCount,
                    users: mongooseDocumentsToObject(users),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    // GET own/trash/users
    trashUsers(req, res, next) {
        User.findDeleted({})
            .then((users) => {
                res.render('own/users/list/trash.hbs', {
                    users: mongooseDocumentsToObject(users),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    // 4. News warehouse

    // GET own/stored/news
    storedNews(req, res, next) {
        Promise.all([News.find({}), News.countDocumentsDeleted()])
            .then(([news, deletedCount]) => {
                res.render('own/news/list/store.hbs', {
                    deletedCount,
                    news: mongooseDocumentsToObject(news),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    // GET own/trash/news
    trashNews(req, res, next) {
        News.findDeleted({})
            .then((news) => {
                res.render('own/news/list/store.hbs', {
                    news: mongooseDocumentsToObject(news),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    // 5. Workingspaces warehouse

    // GET own/stored/workingspaces
    storedWorkingspaces(req, res, next) {
        Promise.all([Event.find({}), Event.countDocumentsDeleted()])
            .then(([workingspaces, deletedCount]) => {
                res.render('own/workingspaces/list/store.hbs', {
                    deletedCount,
                    workingspaces: mongooseDocumentsToObject(workingspaces),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    // GET own/trash/workingspaces
    trashWorkingspaces(req, res, next) {
        Event.findDeleted({})
            .then((workingspaces) => {
                res.render('users/workingspaces/list/trash.hbs', {
                    workingspaces: mongooseDocumentsToObject(workingspaces),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    // 6.Promotions warehouse

    // GET own/stored/promos
    storedPromos(req, res, next) {
        Promise.all([Promo.find({}), Promo.countDocumentsDeleted()])
            .then(([promos, deletedCount]) => {
                res.render('own/promos/list/store.hbs', {
                    deletedCount,
                    promos: mongooseDocumentsToObject(promos),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    // GET own/trash/promos
    trashPromos(req, res, next) {
        Promo.findDeleted({})
            .then((promos) => {
                res.render('own/promos/list/trash.hbs', {
                    promos: mongooseDocumentsToObject(promos),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    // 7. Orders warehouse

    // GET own/stored/orders
    storedOrders(req, res, next) {
        Promise.all([Orders.find({}), Orders.countDocumentsDeleted()])
            .then(([orders, deletedCount]) => {
                res.render('own/orders/list/store.hbs', {
                    deletedCount,
                    orders: mongooseDocumentsToObject(orders),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    

    // GET own/trash/orders
    trashOrders(req, res, next) {
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

    // 8. Notis warehouse

    // GET own/stored/notis
    storedNotis(req, res, next) {
        Promise.all([Noti.find({}), Noti.countDocumentsDeleted()])
            .then(([orders, deletedCount]) => {
                res.render('notis/list/store.hbs', {
                    deletedCount,
                    notis: mongooseDocumentsToObject(notis),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    // GET own/trash/notis
    trashNotis(req, res, next) {
        Noti.findDeleted({
                username: res.locals.user.username
            })
            .then((notis) => {
                res.render('notis/list/trash.hbs', {
                    notis: mongooseDocumentsToObject(notis),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    // 9. food warehouse

    // GET own/stored/food
    storedFood(req, res, next) {
        Promise.all([Food.find({}), Food.countDocumentsDeleted()])
            .then(([food, deletedCount]) => {
                res.render('own/food/list/store.hbs', {
                    deletedCount,
                    food: mongooseDocumentsToObject(food),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    // GET own/trash/food
    trashFood(req, res, next) {
        Food.findDeleted({})
            .then((food) => {
                res.render('own/food/list/trash.hbs', {
                    food: mongooseDocumentsToObject(food),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },


    // 10. workingspaces warehouse

    // GET own/stored/workingspaces
    storedWorkingspaces(req, res, next) {
        Promise.all([Workingspace.find({}), Workingspace.countDocumentsDeleted()])
            .then(([workingspaces, deletedCount]) => {
                res.render('own/workingspaces/list/store.hbs', {
                    deletedCount,
                    workingspaces: mongooseDocumentsToObject(workingspaces),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    // GET own/trash/workingspaces
    trashWorkingspaces(req, res, next) {
        Workingspace.getfindDeleted({})
            .then((workingspaces) => {
                res.render('own/workingspace/list/trash.hbs', {
                    workingspaces: mongooseDocumentsToObject(workingspaces),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    




};

export default OwnController;