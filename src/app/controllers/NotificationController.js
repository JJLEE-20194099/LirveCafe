import Comment from '../models/Comment.js';
import Noti from '../models/Noti.js';

import { 
    singleMongooseDocumentToObject,
    mongooseDocumentsToObject
} from '../../support_lib/mongoose.js';

import {
    getNoNewNotis
} from '../../support_lib/noti.js'


const NotificationController = {

    getNotisByUser: function(req, res, next) {
        const username = req.params.username;
        Promise.all([Noti.find({username: username}), Noti.countDocumentsDeleted({username: username})])
            .then(([notis, deletedCount]) => {
                
                res.render('notis/list/store.hbs', {
                    my_notis: mongooseDocumentsToObject(notis),
                    user: res.locals.user,
                    cart: res.locals.cart,
                    notis: res.locals.notis,
                    no_new_notis: getNoNewNotis(res.locals.notis),
                    deletedCount
                });
            }).catch(next);
    },

    getNotisTrashByUser: function(req, res, next) {
        Noti.findDeleted({
            username: res.locals.user.username
        })
        .then((notis) => {
            res.render('notis/list/trash.hbs', {
                notis: mongooseDocumentsToObject(notis),
                user: res.locals.user,
                no_new_notis: getNoNewNotis(res.locals.notis)
            })
        }).catch(next);
    },

    getCommentNotification: function(req, res, next) {
        const data = req.body;
        const parentCommentId = data.parentCommentId;
        
        Comment.findOne({_id: parentCommentId})
            .then((comment) => {
                res.send({reply: data, parentComment: singleMongooseDocumentToObject(comment)})
            }).catch(next)
        
    },

    getNotiById: function (req, res, next) {
        const data = req.body;
        const id = data.id;

        
         
        Noti.updateOne({_id: id}, {isRead: 1})
            .then(() => Noti.findOne({_id: id}))
            .then((noti) => {
                noti = singleMongooseDocumentToObject(noti)
               
                res.send(noti)
            })
    },

   
 // POST /post-notice

    postNotice(req, res, next) {
        const noti = new Noti(req.body)
        noti.save()
            .then((n) => {
                n = singleMongooseDocumentToObject(n);
                res.send(n)
            })
            .catch(next)
    },

      // SOFT DELETE /notis/:id
      softDelete(req, res, next) {
        Noti.delete({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // DEEP DELETE /notis/:id/force
    deepDelete(req, res, next) {
        Noti.deleteOne({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // RESTORE Noti (PATCH) /notis/:id/restore
    restore(req, res, next) {
        Noti.restore({
                _id: req.params.id
            })
            .then(() => res.redirect('back'))
            .catch(next);
    },
}

export default NotificationController;