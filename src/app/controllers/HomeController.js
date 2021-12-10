import Book from '../models/Book.js';
import Coffee from '../models/Coffee.js';
import User from '../models/User.js';


import {
    mongooseDocumentsToObject,
    singleMongooseDocumentToObject
} from '../../support_lib/mongoose.js';

const HomeController = {
    index: function (req, res, next) {
        console.log('huhu', req.signedCookies.userId)
        Promise.all([Book.find({}), Coffee.find({}), User.findOne({
                _id: req.signedCookies.userId
            })])
            .then(([books, coffee, user]) => {
                books = mongooseDocumentsToObject(books)
                coffee = mongooseDocumentsToObject(coffee)
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
                    });
                } else {
                    res.render('./home/home.hbs', {
                        user: u,
                        books: books,
                        coffee: coffee,
                    });
                }

            }).catch(next)


    }
}

export default HomeController;