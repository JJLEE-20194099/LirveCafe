import mongoose from 'mongoose';
import slug from 'mongoose-slug-generator';
import mongooseDelete from 'mongoose-delete';

const {Schema} = mongoose;

mongoose.plugin(slug)

const Vote = new Schema(
    {
        username: { type: String, required: true},
        no_vote: { type: Number, min: 0, max: 5, default: 0},
        itemId: { type: String, required: true},
    }, 
    {
        timestamps: true
    }
)

Vote.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
})

export default mongoose.model('Vote', Vote)

