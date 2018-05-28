var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    cartId: {
        type: Schema.Types.ObjectId, 
        ref: 'ShoppingCart',
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    street:  {
        type: String,
        required: true
    },
    orderPoint:  {
        type: Date,
        required: true
    },
    dateOrder:  {
        type: Date,
        required: true
    },
    cardDigit: {
        type: String,
        required: () => {
            return this.cardDigit == 4;
        }
    }
});

module.exports = mongoose.model('Order', OrderSchema);
