const express = require('express');
const router = express.Router();
const CartItem = require('../../models/cartItem');
const Product = require('../../models/product');
const ShoppingCart = require('../../models/shoppingCart');
var passport = require('passport');

router.delete('/deleteAll', isValidUser, (req, res) => {
    const userId = req.user._id;
    ShoppingCart.findOne({ userId: userId, ordered: false })
        .exec((err, s_cart) => {
            if (err) {
                handleMessage(res, 404, {
                    err: err
                });
                return;
            }

            if (s_cart == null) {
                handleMessage(res, 401, {
                    message: "Error: cannot find shopping cart!"
                });
                return;
            }

            CartItem.remove({ shoppingCartId: s_cart._id }, (err, product) => {
                if (err) {
                    handleMessage(res, 404, {
                        err: err
                    });
                    return;
                }

                if (product == null) {
                    handleMessage(res, 401, {
                        message: "Error: cannot find products!"
                    });
                    return;
                }

                handleSuccess(res, {
                    remove: true
                });
            });
        });
});

router.delete('/delete/:id', isValidUser, (req, res) => {
    const id = req.params.id;
    ShoppingCart.findOne({ userId: req.user._id, ordered: false }, (err, data) => {
        if (err) {
            handleMessage(res, 404, {
                err: err
            });
            return;
        }

        if (data == null) {
            handleMessage(res, 401, {
                message: "Error: you dont have a shopping cart open."
            });
            return;
        }

        CartItem.remove({ shoppingCartId: data._id, productId: id }, (err, product) => {
            if (err) {
                handleMessage(res, 404, {
                    err: err
                });
                return;
            }

            if (product == null) {
                handleMessage(res, 401, {
                    message: "Error: cannot find this product id!"
                });
                return;
            }

            handleSuccess(res, {
                data: product
            });
        });
    });

});

router.get('/getCartItemById/:id', isValidUser, (req, res) => {
    ShoppingCart.findOne({ userId: req.user._id, ordered: false }, (err, data) => {
        if (err) {
            handleMessage(res, 404, {
                err: err
            });
            return;
        }

        if (data == null) {
            handleMessage(res, 401, {
                message: "Error: you dont have a shopping cart open."
            });
            return;
        }

        CartItem.findOne({ shoppingCartId: data._id, productId: req.params.id }, (err, cartItems) => {
            if (err) {
                handleMessage(res, 404, {
                    err: err
                });
                return;
            }

            if (cartItems == null) {
                handleMessage(res, 401, {
                    error: err,
                    message: "Error: you dont have a cart items."
                });
                return;
            }

            handleSuccess(res, {
                data: cartItems
            });
        });
    });
});


router.get('/getCartItems', isValidUser, (req, res) => {
    ShoppingCart.findOne({ userId: req.user._id, ordered: false }, (err, data) => {
        if (err) {
            handleMessage(res, 404, {
                err: err
            });
            return;
        }

        if (data == null) {
            handleMessage(res, 401, {
                message: "Error: you dont have a shopping cart open."
            });
            return;
        }

        CartItem.find({ shoppingCartId: data._id }, (err, cartItems) => {
            if (err) {
                handleMessage(res, 404, {
                    err: err
                });
                return;
            }

            if (cartItems == null) {
                handleMessage(res, 401, {
                    error: err,
                    message: "Error: you dont have a cart items."
                });
                return;
            }

            handleSuccess(res, {
                data: cartItems
            });
        });
    });
});

router.post('/add', isValidUser, (req, res) => {

    let productId = req.body.productId,
        amount = parseInt(req.body.amount);

    ShoppingCart.findOne({ userId: req.user._id, ordered: false }, (err, data) => {
        if (err) {
            handleMessage(res, 404, {
                err: err
            });
            return;
        }

        // NONE SHOPPING CART
        if (data == null) {
            // DO SOMTHING WHEN USER DONT HAVE A SHOPPING CART.
            let shoppingCart = new ShoppingCart({
                startDate: Date.now(),
                ordered: false,
                userId: req.user._id
            });

            shoppingCart.save((err, s_data) => {
                if (err) {
                    handleMessage(res, 401, {
                        error: err,
                        message: "Error: failed to save a shopping cart!"
                    });
                    return;
                }

                Product.findById(productId)
                    .select("_id name price")
                    .exec((err, product) => {
                        if (err) {
                            handleMessage(res, 401, {
                                error: err,
                                message: "Error: failed to find this product!"
                            });
                            return;
                        }

                        if (product == null) {
                            handleMessage(res, 401, {
                                message: "Error: failed to find this product!"
                            });
                            return;
                        }

                        let cartItem = new CartItem({
                            amount: amount,
                            totalPrice: product.price * amount,
                            productId: product._id,
                            shoppingCartId: s_data._id
                        });

                        cartItem.save((err, result) => {
                            if (err) {
                                handleMessage(res, 401, {
                                    error: err,
                                    message: "Error: failed to save this cart item!"
                                });
                                return;
                            }
                            handleSuccess(res, {
                                data: result,
                                message: "Cart Item Saved!"
                            });
                        });
                    });

                // ADD THE ITEM TO THE NEW SHOPPING CART HERE
            });
            return;
        }

        // HAVE SHOPPING CART

        let shoppingCartIdVar = data._id; // productId // amount

        CartItem.findOne({ shoppingCartId: shoppingCartIdVar, productId: productId }, (err, item) => {
            if (err) {
                handleMessage(res, 401, {
                    error: err
                });
                return;
            }

            if (item == null) {
                Product.findById(productId)
                    .select("_id name price")
                    .exec((err, product) => {
                        if (err) {
                            handleMessage(res, 401, {
                                error: err,
                                message: "Error: failed to find this product!"
                            });
                            return;
                        }

                        if (product == null) {
                            handleMessage(res, 401, {
                                message: "Error: failed to find this product!"
                            });
                            return;
                        }

                        let cartItem = new CartItem({
                            amount: amount,
                            totalPrice: product.price * amount,
                            productId: product._id,
                            shoppingCartId: shoppingCartIdVar
                        });

                        cartItem.save((err, result) => {
                            if (err) {
                                handleMessage(res, 401, {
                                    error: err,
                                    message: "Error: failed to save this cart item!"
                                });
                                return;
                            }
                            handleSuccess(res, {
                                data: result,
                                message: "Cart Item Saved!"
                            });
                        });
                    });
                return;
            }

            CartItem.updateOne({ shoppingCartId: item.shoppingCartId, productId: item.productId }, {
                $set:
                    {
                        amount: parseInt(item.amount) + amount,
                        totalPrice: (item.totalPrice / item.amount) * (parseInt(item.amount) + amount)
                    },
            }, (err, result) => {
                if (err) {
                    handleMessage(res, 401, {
                        error: err
                    });
                    return;
                }

                if (result == null) {
                    if (item == null) {
                        handleMessage(res, 401, {
                            message: "Error: cant update this cart item!"
                        });
                        return;
                    }
                }

                handleSuccess(res, {
                    data: result,
                    message: "Cart Item Saved!"
                });
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