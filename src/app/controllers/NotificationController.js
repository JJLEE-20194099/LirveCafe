import Comment from '../models/Comment.js';
import Noti from '../models/Noti.js';

import { 
    singleMongooseDocumentToObject,
    mongooseDocumentsToObject
} from '../../support_lib/mongoose.js';


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

   
 // POST /post-notice

    postNotice(req, res, next) {
        const noti = new Noti(req.body)
        noti.save()
            .then((noti) => {
                noti = singleMongooseDocumentToObject(noti);
                req.body._id = noti._id;
                res.send(req.body)
            })
            .catch(next)
    }
}

export default NotificationController;