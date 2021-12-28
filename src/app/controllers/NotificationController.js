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
        res.render('notis/list/store.hbs')
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

        
        console.log(data)
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
    }
}

export default NotificationController;