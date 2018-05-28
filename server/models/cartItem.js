var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartItemSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    shoppingCartId: {type: Schema.Types.ObjectId, ref: 'ShoppingCart', required: true},
    productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true}
});

module.exports = mongoose.model('CartIem', CartItemSchema);
