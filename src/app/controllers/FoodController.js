import Food from '../models/Food.js';
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

const FoodController = {

    // GET /food/list
    index(req, res, next) {
        let foodQuery = Food.find({});

        if (res.locals.sort.enabled && res.locals.sort.field != 'default') {
            let asc_or_desc = 1
            if (res.locals.sort.type == 'desc') {
                asc_or_desc = -1
            }


            if (res.locals.sort.field == 'price') {

                foodQuery = foodQuery.sort({
                    price: asc_or_desc
                })
            }

            if (res.locals.sort.field == 'createdAt') {
                foodQuery = foodQuery.sort({
                    createdAt: asc_or_desc
                })
            }

            if (res.locals.sort.field == 'sold') {
                foodQuery = foodQuery.sort({
                    sold: asc_or_desc
                })
            }


        }

        Promise.resolve(foodQuery)
            .then((food) => {
                res.render('food/list/list.hbs', {
                    food: mongooseDocumentsToObject(food),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                });
            }).catch(next);
    },

    // GET /food/:slug
    show(req, res, next) {

        Promise.all([Food.findOne({
                slug: req.params.slug
            }), Food.find({})])
            .then(([food, foods]) => {
                food = singleMongooseDocumentToObject(food)
                foods = mongooseDocumentsToObject(foods)
                Comment.find({
                        itemId: food._id
                    })
                    .sort({
                        updatedAt: -1
                    })
                    .then((commentList) => {
                        res.render('food/item/food_info.hbs', {
                            food: food,
                            foods: foods,
                            commentList: mongooseDocumentsToObject(commentList),
                            user: res.locals.user,
                            cart: res.locals.cart,
                            notis: res.locals.notis,
                            no_new_notis: getNoNewNotis(res.locals.notis)
                        })
                    })

            }).catch(next);
    },

    // GET: /food/buy/:id
    showPayForm(req, res, next) {
        Food.findOne({
                _id: req.params.id
            })
            .then((food) => {
                food = singleMongooseDocumentToObject(food)
                res.render('buy/buyOneItem.hbs', {
                    food: food,
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            })
    },

    // POST: /food/buy

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

    // GET: /food/create
    create(req, res, next) {
        res.render('own/food/item/create.hbs', {
            notis: res.locals.notis,
            no_new_notis: getNoNewNotis(res.locals.notis)
        })
    },

    // POST /food/save
    save(req, res, next) {
        req.body.image = '/' + req.file.path.split('\\').slice(2).join('/');
        const food = new Food(req.body);
        food.save()
            .then(() => res.redirect('/own/stored/food'))
            .catch(next);
    },

    // GET /food/:id/edit

    edit(req, res, next) {
        Food.findOne({
                _id: req.params.id
            })
            .then((food) => {
                res.render('own/food/item/edit.hbs', {
                    food: singleMongooseDocumentToObject(food),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);
    },

    // PATCH /food/:id
    update(req, res, next) {
        if (req.file)
            req.body.image = '/' + req.file.path.split('\\').slice(2).join('/');
        Food.updateOne({
                _id: req.params.id
            }, req.body)
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // SOFT DELETE /food/:id
    softDelete(req, res, next) {
        Food.delete({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // DEEP DELETE /food/:id/force
    deepDelete(req, res, next) {
        Food.deleteOne({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // PATCH /food/:id/restore
    restore(req, res, next) {
        Food.restore({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

}

export default FoodController;