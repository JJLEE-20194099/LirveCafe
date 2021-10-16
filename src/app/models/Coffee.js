import mongoose from 'mongoose';
import slug from 'mongoose-slug-generator';
import mongooseDelete from 'mongoose-delete';

const Scheme = mongoose.Schema;

mongoose.plugin(slug);
const Coffee = new Schema(
    {
        name: {type: String, required: true},
        description: {type: String, required: true},
        image: {type: String, required: true},
        hidden: {type: Boolean},
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


