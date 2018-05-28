var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' }
});

module.exports = mongoose.model('Product', ProductSchema);
