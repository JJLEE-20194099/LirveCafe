import mongoose from 'mongoose'
import mongooseDelete from 'mongoose-delete';

const {Schema} = mongoose;

const Reply = new Schema(
    {
        username: { type: String, required: true},
        avatar: {type: String, required: true},
        content: { type: String, required: true},
        parentCommentId: { type: String, required: true},
        meta: {
            votes: {type: Number, default: 0},
            favs: {type: Number, default: 0}
        }  
    },
    {
        timestamps: true
    }
);

Reply.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
})

export default mongoose.model('Reply', Reply)

