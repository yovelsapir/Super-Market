var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShoppingCartSchema = new Schema({
    startDate: {
        type: Date,
        required: true
    },
    ordered: {
        type: Boolean,
        required: true
    },
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);
