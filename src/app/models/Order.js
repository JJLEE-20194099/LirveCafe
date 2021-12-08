import mongoose from 'mongoose';
import slug from 'mongoose-slug-generator';
import mongooseDelete from 'mongoose-delete';

const {Schema} = mongoose;

const Order = new Schema(
    {
        username: { type: String, required: true },
        name: { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String },
        phone: { type: String, required: true},
        itemId: { type: String, required: true },
        total: { type: Number, min: 0, required: true },
        promoId: {type: String}
    },
    {
        timestamps: true    
    }
);

mongoose.plugin(slug)
Order.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethos: 'all'
});

export default mongoose.model('Order', Order);