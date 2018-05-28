const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const ShoppingCart = require('../../models/shoppingCart');
var passport = require('passport');

router.get('/exist', isValidUser, (req, res) => {
    ShoppingCart.findOne({ userId: req.user._id, ordered: false }, (err, data) => {
        if (err) {
            handleMessage(res, 404, {
                err: err,
                data: false
            });
            return;
        }
        if (data == null) {
            handleMessage(res, 404, {
                message: 'Error: You dont have a shopping cart opened yet.',
                data: false
            });
            return;
        }
        handleSuccess(res, {
            message: "You have a opened shopping cart!",
            data: data
        });
    });
});

router.delete('/delete', isValidUser, (req, res) => {
    ShoppingCart.findOneAndRemove({ _id: req.user._id }, (err, data) => {
        if (err) {
            handleMessage(res, 404, {
                err: err
            });
            return;
        }
        if (data == null) {
            handleMessage(res, 404, {
                message: 'Error: You dont have a shopping cart opened yet.',
                data: false
            });
            return;
        }
        handleSuccess(res, {
            message: "the shopping cart was deleted successfully."
        });
    });
});

router.get('/add', isValidUser, (req, res) => {
    ShoppingCart.findOneAndRemove({ _id: req.user._id, ordered: false }, (err, data) => {
        if (err) {
            handleMessage(res, 404, {
                err: err
            });
            return;
        }

        let shoppingCart = new ShoppingCart({
            startDate: Date.now(),
            ordered: false,
            userId: req.user._id
        });

        shoppingCart.save((err, data) => {
            if (err) {
                handleMessage(res, 401, {
                    error: err,
                    message: "Error: failed to save a shopping cart!"
                });
                return;
            }

            handleSuccess(res, {
                data: data,
                message: "Create a new shopping cart successful!"
            });
        });
    });
});

function isValidUser(req, res, next) {
    if (req.isAuthenticated()) next();
    else return res.status(401).json({ message: 'Unauthorized Request' });
}

function handleMessage(res, status, data) {
    res.status(status).json(data);
}

function handleSuccess(res, data) {
    res.status(200).json(data);
}

module.exports = router;