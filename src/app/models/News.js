import mongoose from 'mongoose';
import slug from 'mongoose-slug-generator';
import mongooseDelete from 'mongoose-delete';

const {Schema} = mongoose;

mongoose.plugin(slug)

const News = new Schema(
    {
        discountPercentage: {type: Number, required: true},
        applicableObject: {type: Number, required: true},
        condition: {type: Number, required: true},
        image: {type: String, default: "https://www.templaza.com/images/easyblog_images/924/what-do-you-know-about-vietnamese-tet-holiday-392_XL.png"},
        eventStartDate: {type: String, required: true},
        eventStartTime: {type: String, required: true},
        eventEndDate: {type: String, required: true},
        eventEndTime: {type: String, required: true},
    },
    {
        timestamps: true
    }
)

News.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
})

export default mongoose.model('News', News)

