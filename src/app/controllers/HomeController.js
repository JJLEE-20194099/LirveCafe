import Book from '../models/Book.js';
import Coffee from '../models/Coffee.js';


import { 
    mongooseDocumentsToObject 
} from '../../support_lib/mongoose.js';

const HomeController = {
    index: function(req, res, next) {
        console.log(1)
        Promise.all([Book.find({}), Coffee.find({})])
            .then(([books, coffee]) => {
                books = mongooseDocumentsToObject(books)
                coffee = mongooseDocumentsToObject(coffee)
                res.render('./home/home.hbs', {
                    user: res.locals.user,
                    books: books,
                    coffee: coffee,
                });
            }).catch(next)

        
    }
}

export default HomeController;