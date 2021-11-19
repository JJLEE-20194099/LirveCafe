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
        meta: {
            votes: {type: Number, default: 0},
            favs: {type: Number, default: 0}
        },
    },
    {
        timestamps: true
    }
);

Coffee.plugin(mongooseDelete, {
    deleteAt: true,
    overrideMethods: 'all',
});

export default mongoose.model('Coffee', Coffee)


