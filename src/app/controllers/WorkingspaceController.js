import Workingspace from '../models/Workingspace.js';
import Coffee from '../models/Coffee.js';
import Food from '../models/Food.js';
import User from '../models/User.js';
import {
    singleMongooseDocumentToObject,
    mongooseDocumentsToObject
} from '../../support_lib/mongoose.js';

import {
    getNoNewNotis
} from '../../support_lib/noti.js'

import {
    getProduct
} from '../../support_lib/workingspace.js'

import {
    promises
} from 'stream';

const getFullWorkingSpaceItemListData = function (workingspace) {
    let foods = workingspace.foods;
    let drinks = workingspace.drinks;
    let food_promises = []
    for (let food of foods) {
        food_promises.push(Food.findOne({
            _id: food.food_id
        }))
    }
    let drink_promises = []
    for (let drink of drinks) {
        drink_promises.push(Coffee.findOne({
            _id: drink.drink_id
        }))
    }
    return [food_promises, drink_promises];
}

const WorkingspaceController = {

    // GET /workingspaces/list

    index(req, res, next) {
        Workingspace.find({})
            .then((workingspaces) => {
                res.render('workingspaces/list/list.hbs', {
                    workingspaces: mongooseDocumentsToObject(workingspaces),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            }).catch(next);



    },

    // GET /workingspaces/:slug
    show(req, res, next) {
        Workingspace.findOne({
                slug: req.params.slug
            })
            .then((workingspace) => {
                const food_promises = getFullWorkingSpaceItemListData(singleMongooseDocumentToObject(workingspace))[0]
                const drink_promises = getFullWorkingSpaceItemListData(singleMongooseDocumentToObject(workingspace))[1]

                Promise.all([Promise.all(food_promises), Promise.all(drink_promises)])
                    .then(([food_lists, drink_lists]) => {
                        food_lists = mongooseDocumentsToObject(food_lists)
                        drink_lists = mongooseDocumentsToObject(drink_lists)
                        workingspace = singleMongooseDocumentToObject(workingspace)
                        for (var i = 0; i < food_lists.length; i++) {
                            workingspace.foods[i] = {
                                food: food_lists[i],
                                quantity: workingspace.foods[i].quantity
                            }
                        }
                        for (var j = 0; j < drink_lists.length; j++) {
                            workingspace.drinks[j] = {
                                drink: drink_lists[j],
                                quantity: workingspace.drinks[j].quantity
                            }
                        }
                        // console.log(workingspace)
                        res.render('own/workingspaces/item/workingspace_info.hbs', {
                            workingspace: workingspace,
                            user: res.locals.user,
                            notis: res.locals.notis,
                            no_new_notis: getNoNewNotis(res.locals.notis)
                        })
                    })


            }).catch(next)


    },



    // GET /workingspaces/create
    create(req, res, next) {

        Promise.all([Coffee.find({}), Food.find({}), User.findOne({
                _id: req.signedCookies.userId
            })])
            .then(([coffee, food, user]) => {

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
                    res.render('workingspaces/item/create.hbs', {

                        coffee: coffee,
                        food: food,
                        notis: res.locals.notis,
                        no_new_notis: getNoNewNotis(res.locals.notis)
                    });
                } else {
                    res.render('workingspaces/item/create.hbs', {
                        user: u,

                        coffee: coffee,
                        food: food,
                        notis: res.locals.notis,
                        no_new_notis: getNoNewNotis(res.locals.notis)
                    });
                }

            }).catch(next)

    },

    //POST /workingspaces/save
    save(req, res, next) {
        console.log("here")
        let avatar = ''

        if (!req.file || !req.file.path || req.file.path == '') {
            req.body.avatar = "http://www.davidkrugler.com/s/River-Lights-8318.jpg";
            avatar = "http://www.davidkrugler.com/s/River-Lights-8318.jpg"
        } else {
            avatar = req.file.path
            avatar = '/' + avatar.split('\\').slice(2).join('/')
        }



        const data = req.body;
        const username = data.username
        delete data.username;
        const email = data.email
        delete data.email;
        const eventBooker = data.eventBooker
        delete data.eventBooker;
        const title = data.title
        delete data.title;
        const no_seating = data.no_seating
        delete data.no_seating;
        const phone = data.phone
        delete data.phone;
        const description = data.description
        delete data.description;
        const eventStartDate = data.eventStartDate
        delete data.eventStartDate;
        const eventStartTime = data.eventStartTime
        delete data.eventStartTime;
        const eventEndDate = data.eventEndDate
        delete data.eventEndDate;
        const eventEndTime = data.eventEndTime
        delete data.eventEndTime;
        var total = data.total
        delete data.total;
        const split = parseInt(data["split"])
        delete data.split;
        delete data.avatar

        var cnt = 0;

        const foods = []
        const drinks = []

        for (var key in data) {
            if (cnt < split) {
                foods.push({
                    food_id: key,
                    quantity: parseInt(data[key])
                })
            } else {
                drinks.push({
                    drink_id: key,
                    quantity: parseInt(data[key])
                })
            }
            cnt += 1
        }

        const my_data = {
            username: username,
            email: email,
            eventBooker: eventBooker,
            title: title,
            no_seating: no_seating,
            phone: phone,
            description: description,
            eventStartDate: eventStartDate,
            eventStartTime: eventStartTime,
            eventEndDate: eventEndDate,
            eventEndTime: eventEndTime,
            total: total,
            avatar: avatar,
            foods: foods,
            drinks: drinks,
        }

        console.log(my_data)

        const start_date = parseInt(eventStartDate.split('-')[2])
        const end_date = parseInt(eventEndDate.split('-')[2])
        const start_hour = parseInt(eventStartTime.split(':')[0])
        const start_minute = parseInt(eventStartTime.split(':')[1])
        const end_hour = parseInt(eventEndTime.split(':')[0])
        const end_minute = parseInt(eventEndTime.split(':')[1])

        const seat_time = (end_date - start_date) * 24 * 60 + (end_hour - start_hour) * 60 + (end_minute - start_minute)
        const seat_fee = (seat_time / 60) * parseInt(no_seating) * 25 * 1000;


        total = parseInt(total) + seat_fee
        my_data["total"] = total


        const workingspace = new Workingspace(my_data);

        var check_data = getProduct(my_data)
        const quantity_list = check_data[1]
        const id_list = check_data[2]
        var type;
        var check = true
        var item_excepion;
        var updatePromises = []

        Promise.all(check_data[0].map(promise => promise()))
            .then((product_list) => {
                for (var i = 0; i < product_list.length; i++) {
                    let product = singleMongooseDocumentToObject(product_list[i]);

                    if (i < my_data.foods.length) {
                        if (product.quantity < quantity_list[i]) {
                            item_excepion = product;
                            type = "food"
                            check = false
                        } else {
                            product.quantity -= quantity_list[i]
                            product.no_sold += quantity_list[i]

                            updatePromises.push(() => Food.updateOne({
                                _id: id_list[i]
                            }, product))
                        }
                    } else {
                        if (product.quantity < quantity_list[i]) {
                            item_excepion = product;
                            type = "coffee"
                            check = false
                        } else {
                            product.quantity -= quantity_list[i]
                            product.no_sold += quantity_list[i]

                            updatePromises.push(() => Coffee.updateOne({
                                _id: id_list[i]
                            }, product))
                        }
                    }

                    if (check == false) break;

                }

                if (check) {
                    Promise.all([workingspace.save(), Promise.all(updatePromises.map(promise => promise()))])
                        .then(([wk, _]) => {
                            wk = singleMongooseDocumentToObject(wk)
                            res.send({
                                check: true,
                                wk: wk
                            })
                        })
                } else {
                    res.send({
                        check: false,
                        item: item_excepion,
                        type: type
                    })
                }

            }).catch(next)

    },

    // GET /workingspaces/:id/edit
    edit(req, res, next) {
        Workingspace.findOne({
                _id: req.params.id
            })
            .then((workingspace) => {
                res.render('workingspaces/item/edit.hbs', {
                    workingspace: singleMongooseDocumentToObject(workingspace),
                    user: res.locals.user,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            })
            .catch(next)
    },

    // PUT /workingspaces/:id
    update(req, res, next) {
        Workingspace.updateOne({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next)
    },

    // SOFT DELETE /workingspaces/:id
    softDelete(req, res, next) {
        Workingspace.delete({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // DEEP DELETE /books/:id/force
    deepDelete(req, res, next) {
        Workingspace.deleteOne({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // RESTORE BOOK (PATCH) /books/:id/restore
    restore(req, res, next) {
        Workingspace.restore({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    }


};

export default WorkingspaceController;