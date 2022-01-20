import User from '../models/User.js';
import Book from '../models/Book.js';
import Coffee from '../models/Coffee.js';
import Orders from '../models/Orders.js';
import {
    singleMongooseDocumentToObject,
    mongooseDocumentsToObject
} from '../../support_lib/mongoose.js';

import {
    getAvatar
} from '../../support_lib/avatar_processing.js';

import {
    removeAccents
} from '../../support_lib/text.js'

import {
    getNoNewNotis
} from '../../support_lib/noti.js'

const UserController = {

    // GET /users/list
    index(req, res, next) {
        User.find({})
            .then((users) => {

                res.render('own/users/list/store.hbs', {
                    users: mongooseDocumentsToObject(users),
                    user: res.locals.user

                });
            }).catch(next);
    },

    // GET: /users/:slug
    show(req, res, next) {
        User.findOne({
                _id: req.params.id
            })
            .then((user) => {
                res.render('users/info/item/edit.hbs', {
                    user: singleMongooseDocumentToObject(user),
                })
            })
            .catch(next);
    },

    // GET: /users/create
    create(req, res, next) {
        res.render('users/info/item/create.hbs', {
            user: res.locals.user
        });
    },

    // POST : /users/save
    save(req, res, next) {
    
        User.findOne({
                username: req.body.username
            })
            .then((u) => {
                if (!u) {
                    req.body.avatar = getAvatar(req);
                    if (!req.body.avatar || req.body.avatar == '') {
                        const name = req.body.firstname + ' ' + req.body.lastname;
                        const file_name = name.split(" ").join("-")
                        req.body.avatar = '/img/' + file_name + '-default.jpg';
                    }
                    let user = new User(req.body);
                    user.save()
                        .then(() => res.render('auth/index', {
                            user: singleMongooseDocumentToObject(user),
                            notis: res.locals.notis,
                            no_new_notis: getNoNewNotis(res.locals.notis)
                        }))
                } else {
                    const errors = []
                    errors.push("Username already exists")
                    const lastnames = req.body.lastname.split(" ")
                    const s = []
                    for (let lastname of lastnames) {
                        s.push(req.body.username.toLowerCase() + "_" + removeAccents(lastname).toLowerCase())
                    }
                    let last_character = removeAccents(req.body.username[req.body.username.length - 1]).toLowerCase()
                    let curr_str = last_character;
                    for (let i = 0; i < 4; i++) {
                        s.push(removeAccents(req.body.username).toLowerCase() + curr_str)
                        curr_str = curr_str + last_character;
                    }
                    errors.push("Suggest: ", s.join(", "))
                    res.render('users/info/item/create.hbs', {
                        errors: errors
                    });
                }
            }).catch(next);
    },

    // [GET] /users/:id/edit
    edit(req, res, next) {
        User.findById(req.params.id)
            .then((user) => {
                res.render('users/item/index.hbs', {
                    user: singleMongooseDocumentToObject(user),
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            })
            .catch(next);
    },

    // [GET] /users/:username/register_loyal_member
    registerLoyalMemeberIndex(req, res, next) {
        Promise.all([User.findOne({
                username: req.params.username
            }), Orders.find({
                username: req.params.username
            })])
            .then(([user, orders]) => {
                if (!orders)
                    orders = []
                else orders = mongooseDocumentsToObject(orders)

                var total = orders.reduce(function (acc, item) {
                    return acc + item.total
                }, 0)

                res.render('users/loyal_member/index.hbs', {
                    user: singleMongooseDocumentToObject(user),
                    orders: orders,
                    total: total,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            })
            .catch(next);
    },

    // [POST] /users/:username/register_loyal_member
    postRegisterLoyalMemeber(req, res, next) {
        req.body.activating_loyalty = 1
        User.updateOne({
                username: req.body.username
            }, req.body)
            .then(() => User.findOne({
                username: req.body.username
            }))
            .then((user) => {

                res.render('users/info/item/edit.hbs', {
                    user: singleMongooseDocumentToObject(user),
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis)
                })
            })
    },

    // PATCH /users/:id
    update(req, res, next) {

        req.body.avatar = getAvatar(req);
        if (!req.body.avatar || req.body.avatar == '') {
            const name = req.body.firstname + ' ' + req.body.lastname;
            req.body.avatar = '/img/' + name + '-default.jpg';
        }

        // User.findOne({_id: req.params.id})
        //     .then((u) => {
        //         u = singleMongooseDocumentToObject(u)
        //         if (u.avatar.includes('-default.jpg') && u.avatar.includes('/img/')) {

        //         }
        //     })

        User.updateOne({
                _id: req.params.id
            }, req.body)
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // SOFT DELETE /users/:id
    softDelete(req, res, next) {
        User.delete({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // DEEP DELETE /users/:id/force
    deepDelete(req, res, next) {
        User.deleteOne({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // RESTORE User (PATCH) /users/:id/restore
    restore(req, res, next) {
        User.restore({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },





};

export default UserController;