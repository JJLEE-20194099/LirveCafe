import mongoose from 'mongoose';
import slug from 'mongoose-slug-generator';
import mongooseDelete from 'mongoose-delete';

const {Schema} = mongoose;

const Workingspace = new Schema(
    {   
        username: {type: String, required: true},
        eventBooker: {type: String, required: true},
        title: {type: String, required: true},
        description: {type: String},
        image: {type: String, default: "http://www.davidkrugler.com/s/River-Lights-8318.jpg"},
        no_seating: {type: Number, requiresd: true},
        email: {type: String, required: true},
        phone: {type: String, required: true},
        total: {type: Number, required: true},
        // promoId: {type: String},
        eventStartDate: {type: String, required: true},
        eventStartTime: {type: String, required: true},
        eventEndDate: {type: String, required: true},
        eventEndTime: {type: String, required: true},
        foods: [new Schema({
                    food_id: {type: String, required:true},
                    quantity: {type: String, required: true, min: 1}
                })],
        drinks: [new Schema({
            drink_id: {type: String, required:true},
            quantity: {type: String, required: true, min: 1}
        })],        
        slug: {type: String, slug: 'title', unique: true}

    },
    {
        timestamps: true
    }
);

mongoose.plugin(slug);
Workingspace.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});

export default mongoose.model('Workingspace', Workingspace);