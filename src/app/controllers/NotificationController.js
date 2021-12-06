import Comment from '../models/Comment.js';


import { 
    singleMongooseDocumentToObject
} from '../../support_lib/mongoose.js';


const NotificationController = {
    index: function(req, res, next) {
        res.render('users/noti/index.hbs')
    },

    getCommentNotification: function(req, res, next) {
        const data = req.body;
        const parentCommentId = data.parentCommentId;
        
        Comment.findOne({_id: parentCommentId})
            .then((comment) => {
                res.send({reply: data, parentComment: singleMongooseDocumentToObject(comment)})
            }).catch(next)
        
    }
}

export default NotificationController;