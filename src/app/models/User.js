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
        star_no: {type: Number, default: 0},
        role: {type: String, default: "guest"},
        level: {type: Number, default: 0}
    },
    {
        timestamps: true,
    }
);

mongoose.plugin(slug);
User.plugin(mongooseDelete, {
    deleteAt: true,
    overrideMethods: 'all'
})

export default mongoose.model('User', User);