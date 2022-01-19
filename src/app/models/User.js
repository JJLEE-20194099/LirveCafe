import mongoose from 'mongoose';
import slug from 'mongoose-slug-generator';
import mongooseDelete from 'mongoose-delete';


const {Schema} = mongoose;

const User = new Schema(
    {
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        email: {type: String, required: true},
        phone: {type: String, required: true},
        username: {type: String},
        password: {type: String, required: true},
        avatar: {type: String},
        birthday: {type: String},
        gender: {type: Number},
        star_no: {type: Number, default: 0},
        role: {type: Number, default: 0},
        level: {type: Number, default: 0},
        activating_loyalty: {type: Number, default: 0, min: 0, max: 1},
        registered_level: {type: Number, default: 0}
    },
    {
        timestamps: true,
    }
);

mongoose.plugin(slug);
User.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
})

export default mongoose.model('User', User);