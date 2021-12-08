import mongoose from 'mongoose';
import slug from 'mongoose-slug-generator';
import mongooseDelete from 'mongoose-delete';

const { Schema } = mongoose;
mongoose.plugin(slug);

const Promo = new Schema(
    {
        name: {type: 'string', required: true},
        discountPercentage: {type: Number, min: 0, max: 100, default: 0},
        discountAmount: {type: Number, min: 0, default: 0},
        condition: {type: Number, required: true, min: 0, default: 0},
        limitEachDay: {type: Number, min: 1, default: 1},
        description: {type: 'string', required: true},
        meta: {
            votes: {type: Number, default: 0},
            favs: {type: Number, default: 0}
        },
        expirationDate: {type: Date, required: true},   
    }
)

Promo.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
})

export default mongoose.model('Promo', Promo)