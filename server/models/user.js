var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    role: [{
        type: String,
        required: true
    }],
    creation_dt: { type: Date, require: true }
});

schema.statics.hashPassword = function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

schema.methods.isValid = function (hashedpassword) {
    return bcrypt.compareSync(hashedpassword, this.password);
}

module.exports = mongoose.model('User', schema);