import User from '../models/User.js';
import { 
    singleMongooseDocumentToObject,
    mongooseDocumentsToObject
} from '../../support_lib/mongoose.js';

import { getAvatar } from '../../support_lib/avatar_processing.js';

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
        User.findOne({ _id: req.params.id })
            .then((user) => {
                res.render('users/item/user_info.hbs', {
                    user: singleMongooseDocumentToObject(user),
                    user: res.locals.user
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
        req.body.avatar = getAvatar(req);
        if (!req.body.avatar || req.body.avatar == '') {
            const name = req.body.firstname + ' ' + req.body.lastname;
            req.body.avatar = '/img/' + name + '-default.jpg'; 
        }
        const user = new User(req.body);
        user.save()
            .then(() => res.render('home/home.hbs', {user: user}))
            .catch(next);
    },  

    // [GET] /users/:id/edit
    edit(req, res, next) {
        User.findById(req.params.id)
            .then((user) => {
                res.render('users/item/edit.hbs', {
                    user: singleMongooseDocumentToObject(user),
                })
            })
            .catch(next);
    },

    // PATCH /users/:id
    update(req, res, next) {
        User.updateOne({_id: req.params.id}, req.body)
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // SOFT DELETE /users/:id
    softDelete(req, res, next) {
        User.delete({_id: req.params.id})
        .then(() => res. redirect('back'))
        .catch(next);
    },

    // DEEP DELETE /users/:id/force
    deepDelete(req, res, next) {
        User.deleteOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // RESTORE User (PATCH) /users/:id/restore
    restore(req, res, next) {
        User.restore({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    },

   

    
    
};

export default UserController;
