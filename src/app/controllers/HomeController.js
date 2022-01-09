import Book from '../models/Book.js';
import Coffee from '../models/Coffee.js';
import Food from '../models/Food.js';
import User from '../models/User.js';

import {
    mongooseDocumentsToObject,
    singleMongooseDocumentToObject
} from '../../support_lib/mongoose.js';

import {
    getNoNewNotis
} from '../../support_lib/noti.js'

const HomeController = {
    index: function (req, res, next) {
        // console.log(req.signedCookies.userId)
        Promise.all([Book.find({}), Coffee.find({}), Food.find({}), User.findOne({
                _id: req.signedCookies.userId
            })])
            .then(([books, coffee, food, user]) => {
                books = mongooseDocumentsToObject(books)
                coffee = mongooseDocumentsToObject(coffee)
                food = mongooseDocumentsToObject(food)
                var u = '';
                if (user) {
                    u = singleMongooseDocumentToObject(user)
                } else {
                    u = res.locals.user
                }

            
                    

                if (!u) {
                    res.clearCookie("userId");
                    res.render('./home/home.hbs', {
                        books: books,
                        coffee: coffee,
                        food: food,
                        notis: res.locals.notis,
                        
                        no_new_notis: getNoNewNotis(res.locals.notis)
                    });
                } else {
                    res.render('./home/home.hbs', {
                        user: u,
                        books: books,
                        coffee: coffee,
                        food: food,
                        notis: res.locals.notis,
                        cart: res.locals.cart,
                        no_new_notis: getNoNewNotis(res.locals.notis)
                    });
                }

            }).catch(next)


    },
    
    suggestIndex: function (req, res, next) {
        Promise.all([Book.find({}), Coffee.find({}), Food.find({})])
            .then(([books, coffee, food]) => {
                books = mongooseDocumentsToObject(books)
                coffee = mongooseDocumentsToObject(coffee)
                food = mongooseDocumentsToObject(food)
                res.send({books, food, coffee})
            }).catch(next)


    },

}

export default HomeController;