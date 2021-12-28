import Coffee from '../models/Coffee.js';
import Book from '../models/Book.js';
import Promo from '../models/Promo.js';

import { 
    singleMongooseDocumentToObject,
    mongooseDocumentsToObject
} from '../../support_lib/mongoose.js';

import {
    getNoNewNotis
} from '../../support_lib/noti.js'

const SearchController = {
    multiSearch(req, res, next) {
        const key = req.body.searchTxt;
        var searchByNamePattern = '//' + key + '//';
        const promoTagList = ["%", "Giảm giá", "coupon", "tối đa", "cho đơn hàng từ", "phí giao hàng", "Discount"]
        var searchByOthersPattern = promoTagList.join() + key;
        Promise.all([
            Book.find({ $or: [ {title: searchByNamePattern}, {author: searchByNamePattern}, {description: searchByNamePattern}, {slug: searchByNamePattern}]}),
            Coffee.find({ $or: [ {name: searchByNamePattern}, {description: searchByNamePattern},  {slug: searchByNamePattern}]}),
            Promo.find({ $or: [ {name: searchByOthersPattern}, {description: searchByOthersPattern},  {slug: searchByOthersPattern}]}),
        ])
        .then(([books, coffee, promos]) => {
            if (books)
                { books = mongooseDocumentsToObject(books); }
            else books = [];

            if (coffee)
                { coffee = mongooseDocumentsToObject(coffee); }
            else coffee = [];

            if (promos)
                { promos = mongooseDocumentsToObject(promos); }
            else promos = [];

            const data = {
                books,
                coffee,
                promos
            }

            res.send(data);
        })
        .catch(next);

    }
}


export default SearchController;