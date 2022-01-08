import mongoose from 'mongoose';
import slug from 'mongoose-slug-generator';
import mongooseDelete from 'mongoose-delete';

const {Schema} = mongoose;

mongoose.plugin(slug);
const Coffee = new Schema(
    {
        name: {type: String, required: true},
        description: {type: String, required: true},
        image: {type: String, required: true},
        price: {type: String, required: true},
        slug: {type: String, slug: 'name', unique: true},
        sold: {type: Number, default: 0},
        meta: {
            votes: {type: Number, default: 0},
            favs: {type: Number, default: 0}
        },
        quantity: {type: Number, required: true, default: 0},
        no_sold: {type: Number, default: 0},
    },
    {
        timestamps: true
    }
);

Coffee.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

export default mongoose.model('Coffee', Coffee)


