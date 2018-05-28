const express = require('express');
const router = express.Router();
const Order = require('../../models/order');
const User = require('../../models/user');
const ShoppingCart = require('../../models/shoppingCart');
const CartItem = require('../../models/cartItem');
const passport = require('passport');
const fs = require('fs');

router.get('/download', (req, res, next) => {
    res.download(`./uploads/${req.user._id}.txt`);
});

// Member Routes //
router.get('/count', (req, res) => {
    Order.find({}, (err, orders) => {
        handleSuccess(res, {
            count: orders.length
        });
    });
});

router.get('/last_order/date', isValidUser, (req, res) => {
    Order.findOne({ userId: req.user._id })
        .select('userId dateOrder')
        .sort({ dateOrder: 1 })
        .exec((err, order) => {
            if (err) {
                handleMessage(res, 404, {
                    err: err
                });
                return;
            }

            if (order == null) {
                handleMessage(res, 404, {
                    message: 'Cant find order.'
                });
                return;
            }

            handleSuccess(res, order);
        });
});

router.get('/dateCount/:date', isValidUser, (req, res) => {
    if(req.params['date'] == undefined){
        handleMessage(res, 404, {
            message: 'Cant find order.'
        });
        return;
    }
    const date = new Date(req.params.date);
    const localDate = date.toLocaleDateString();
    Order.find({ })
        .select('orderPoint')
        .sort({ dateOrder: 1 })
        .exec((err, order) => {
            if (err) {
                handleMessage(res, 404, {
                    err: err
                });
                return;
            }

            if (order == null) {
                handleMessage(res, 404, {
                    message: 'Cant find order.'
                });
                return;
            }
            let dateResult = [];
            let count = 0;
            for (const i in order) {
                if (localDate == order[i]['orderPoint'].toLocaleDateString()) {
                    count++;
                }
                dateResult.push(order[i]['orderPoint'].toLocaleDateString());
            }
            handleSuccess(res, { date: localDate, count: count });
        });
});

router.post('/add', isValidUser, (req, res) => {
    let userId = req.user._id;

    ShoppingCart.findOne({ userId: userId, ordered: false })
        .exec((err, s_cart) => {
            // ERROR 
            if (err) {
                res.status(401).json({
                    error: err,
                    message: "Error: failed to find shopping cart!"
                });
                return;
            }
            // EMPTY
            if (s_cart == null) {
                handleMessage(res, 404, {
                    message: 'Cant find shopping cart.'
                });
                return;
            }

            // let result = getArrayOfDate(req.body.orderPoint);
            // let date = new Date(`${result[1]} ${result[0]}, ${result[2]} 12:00:00`);

            let order = new Order({
                userId: userId,
                cartId: s_cart._id,
                totalPrice: Number(req.body.totalPrice),
                address: req.body.address,
                street: req.body.street,
                orderPoint: req.body.orderPoint,
                dateOrder: new Date(),
                cardDigit: req.body.cardDigit
            });

            ShoppingCart.updateOne({ userId: userId, ordered: false }, { $set: { ordered: true } }, (err, s_cart_ordered) => {
                if (err) {
                    handleMessage(res, 404, {
                        error: err
                    });
                    return;
                }

                order.save((err, result) => {
                    if (err) {
                        res.status(401).json({
                            error: err,
                            message: "Error: failed to create order!"
                        });
                        return;
                    }
                    let orderList = '';
                    CartItem.find({ shoppingCartId: s_cart._id })
                        .exec((err, items) => {
                            if (err) {
                                res.status(401).json({
                                    error: err,
                                });
                                return;
                            }

                            for (let i in items) {
                                orderList += `id: ${items[i]['productId']} | amount: ${items[i]['amount']} | ${items[i]['totalPrice']}$\r\n`;
                            }

                            fs.writeFile(`./uploads/${req.user._id}.txt`,
                                `
                                Hello, ${req.user.name}\r\n\r\nyou ordered: ${orderList}\r\norder date: ${new Date()}\r\norder point date: ${req.body.orderPoint}\r\ntotal price: ${req.body.totalPrice}
                                `, function (err) {
                                    if (err)
                                        return console.log(err);
                                });

                            res.status(200).json({
                                order: result,
                                message: "Order created successfully!"
                            });
                        });
                });
            });
        });
});

// function getArrayOfDate(orderPoint) {
//     let result = [];
//     let str = '';
//     for (let i = 0; i < orderPoint.length; i++) {
//         if (orderPoint[i] != '/') {
//             str += orderPoint[i];
//         } else {
//             result.push(str);
//             str = '';
//         }
//     }
//     result.push(str);
//     return result;
// }

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