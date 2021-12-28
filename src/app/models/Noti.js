import mongoose from 'mongoose';
import slug from 'mongoose-slug-generator';
import mongooseDelete from 'mongoose-delete';

const {Schema} = mongoose;

mongoose.plugin(slug);
const Noti = new Schema(
    {
        itemId: {type: String, required: true},
        sender: {type: String, required: true},
        receiver: {type: String, required: true},
        where_url: {type: String, required: true},
        avatar: {type: String, required: true},
        isRead: {type: Number, default: 0},
    },
    {
        timestamps: true
    }
);

Noti.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

export default mongoose.model('Noti', Noti)


