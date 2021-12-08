import mongoose from 'mongoose';
import slug from 'mongoose-slug-generator';
import mongooseDelete from 'mongoose-delete';

const {Schema} = mongoose;

mongoose.plugin(slug)

const Comment = new Schema(
    {
        username: { type: String, required: true},
        avatar: { type: String, required: true},
        content: { type: String, required: true},
        replyList: { type: Array, default: []},
        itemId: { type: String, required: true},
        meta: {
            votes: {type: Number, default: 0},
            favs: {type: Number, default: 0}
        }  
    },
    {
        timestamps: true
    }
)

Comment.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
})

export default mongoose.model('Comment', Comment)

