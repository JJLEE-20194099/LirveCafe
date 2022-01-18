import mongoose from 'mongoose';
import slug from 'mongoose-slug-generator';
import mongooseDelete from 'mongoose-delete';

const {Schema} = mongoose;

mongoose.plugin(slug);
const Book = new Schema(
    {
        title: { type: String, required: true},
        author: { type: String, required: true},
        description: { type: String, required: true},
        image: { type: String, required: true},
        body: {type: String, required: true},
        price: {type: Number, required: true},
        no: {type: Number, required: true},
        slug: { type: String, slug: 'title', unique: true },
        meta: {
            votes: {type: Number, default: 0},
            favs: {type: Number, default: 0}
        },
        quantity: {type: Number, required: true, default: 0},
        no_sold: {type: Number, default: 0},
        saleoff_status: {type: Number, default: 0},
        no_sold_during_saleoff: {type: Number, default: 0},
        discountPercentage: {type: Number, default: 0},
        saleoff_price: {type: Number}
    },
    {
        timestamps: true,
    }
);

Book.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
})

export default mongoose.model('Book', Book)
