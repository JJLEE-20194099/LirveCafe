import Comment from '../models/Comment.js';
import Reply from '../models/Reply.js';
import Noti from '../models/Noti.js';

import { 
    singleMongooseDocumentToObject,
    mongooseDocumentsToObject
} from '../../support_lib/mongoose.js';

import {
    getNoNewNotis
} from '../../support_lib/noti.js'

const CommentControllers = {
    
    // POST /do-comment

     doComment(req, res, next) {
       
        const comment = new Comment(req.body);
        console.log(comment);
        comment.save()
            .then(() => res.send(singleMongooseDocumentToObject(comment)))
            .catch(next)
    },

    // POST /reply-comment

    replyComment(req, res, next) {
        const reply = new Reply(req.body);

        Comment.findOne({_id: req.body.parentCommentId})
            .then((comment) => {
                const replyList = comment.replyList
                replyList.unshift(reply);
                comment.replyList = replyList;
                return new Promise(function(resolve) {
                    comment.save()
                    resolve()
                })
            })
            .then(function() {
                return new Promise(function(resolve) {
                    reply.save()
                    .then(() => res.send(singleMongooseDocumentToObject(reply)))
                })
            })
            .catch(next)
    },

}

export default CommentControllers;