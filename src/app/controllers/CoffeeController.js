import Coffee from '../models/Coffee.js';
import Comment from '../models/Comment.js';
import Reply from '../models/Reply.js';
import Order from '../models/Order.js'

import {
    singleMongooseDocumentToObject,
    mongooseDocumentsToObject
} from '../../support_lib/mongoose.js';

import {
    getNoNewNotis
} from '../../support_lib/noti.js'

const CoffeeController = {

    // GET /coffee/list
    index(req, res, next) {
        let coffeeQuery = Coffee.find({});

        if (res.locals.sort.enabled && res.locals.sort.field != 'default') {
            let asc_or_desc = 1
            if (res.locals.sort.type == 'desc') {
                asc_or_desc = -1
            }


            if (res.locals.sort.field == 'price') {

                coffeeQuery = coffeeQuery.sort({
                    price: asc_or_desc
                })
            }

            if (res.locals.sort.field == 'createdAt') {
                coffeeQuery = coffeeQuery.sort({
                    createdAt: asc_or_desc
                })
            }

            if (res.locals.sort.field == 'sold') {
                coffeeQuery = coffeeQuery.sort({
                    sold: asc_or_desc
                })
            }


        }

        Promise.resolve(coffeeQuery)
            .then((coffee) => {

                res.render('drink/list/list.hbs', {
                    coffee: mongooseDocumentsToObject(coffee),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                });
            }).catch(next);
    },

    // GET /coffee/:slug
    show(req, res, next) {

        Promise.all([Coffee.findOne({
                slug: req.params.slug
            }), Coffee.find({})])
            .then(([coffee, coffees]) => {
                coffee = singleMongooseDocumentToObject(coffee)
                coffees = mongooseDocumentsToObject(coffees)
                Comment.find({
                        itemId: coffee._id
                    })
                    .sort({
                        updatedAt: -1
                    })
                    .then((commentList) => {
                        res.render('drink/item/coffee_info.hbs', {
                            coffee: coffee,
                            coffees: coffees,
                            commentList: mongooseDocumentsToObject(commentList),
                            user: res.locals.user,
                            cart: res.locals.cart,
                            notis: res.locals.notis,
                            no_new_notis: getNoNewNotis(res.locals.notis)
                        })
                    })

            }).catch(next);
    },

    // GET: /coffee/buy/:id
    showPayForm(req, res, next) {
        Coffee.findOne({
                _id: req.params.id
            })
            .then((coffee) => {
                coffee = singleMongooseDocumentToObject(coffee)
                res.render('buy/buyOneItem.hbs', {
                    coffee: coffee,
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            })
    },

    // POST: /coffee/buy

    buy(req, res, next) {
        const order = new Order(req.body)

        order.save()
            .then(() => {
                res.send({
                    order: singleMongooseDocumentToObject(order),
                    user: res.locals.user
                })
            }).catch(next);
    },

    // GET: /coffee/create
    create(req, res, next) {
        res.render('own/drink/item/create.hbs', {
            notis: res.locals.notis,
            no_new_notis: getNoNewNotis(res.locals.notis)
        })
    },

    // POST /coffee/save
    save(req, res, next) {
        req.body.image = '/' + req.file.path.split('\\').slice(2).join('/');
        const coffee = new Coffee(req.body);
        coffee.save()
            .then(() => res.redirect('/own/stored/coffee'))
            .catch(next);
    },

    // GET /coffee/:id/edit

    edit(req, res, next) {
        Coffee.findOne({
                _id: req.params.id
            })
            .then((coffee) => {
                res.render('own/drink/item/edit.hbs', {
                    coffee: singleMongooseDocumentToObject(coffee),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    // PATCH /coffee/:id
    update(req, res, next) {
        if (req.file)
            req.body.image = '/' + req.file.path.split('\\').slice(2).join('/');
        Coffee.updateOne({
                _id: req.params.id
            }, req.body)
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // SOFT DELETE /coffee/:id
    softDelete(req, res, next) {
        Coffee.delete({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // DEEP DELETE /coffee/:id/force
    deepDelete(req, res, next) {
        Coffee.deleteOne({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // PATCH /coffee/:id/restore
    restore(req, res, next) {
        Coffee.restore({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

}

export default CoffeeController;