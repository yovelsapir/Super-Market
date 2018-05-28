const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const Category = require('../../models/category');
const User = require('../../models/user');
var passport = require('passport');

router.get('/count', (req, res) => {
    Product.find({}, (err, products) => {
        handleSuccess(res, {
            count: products.length
        });
    });
});

router.get('/getProductsById/:id', isValidUser, (req, res) => {
    Product.find({ categoryId: req.params.id }, (err, products) => {
        if (err) {
            handleMessage(res, 404, {
                error: err
            });
            return;
        }
        handleSuccess(res, {
            data: products
        });
    });
});

router.get('/getProductById/:id', isValidUser, (req, res) => {
    Product.findOne({ _id: req.params.id }, (err, product) => {
        if (err) {
            handleMessage(res, 404, {
                error: err
            });
            return;
        }
        handleSuccess(res, {
            data: product
        });
    });
});

router.get('/getProductsByName/:name', isValidUser, (req, res) => {
    Product.find({ name: new RegExp(req.params.name, 'i') }, (err, product) => {
        if (err) {
            handleMessage(res, 404, {
                error: err
            });
            return;
        }
        handleSuccess(res, {
            data: product
        });
    });
});

router.post('/add', isValidUserAndAdmin, (req, res) => {
    console.log(req.body);
    let categoryId = req.body.categoryId;
    Category.findById(categoryId)
        .select("_id")
        .exec((err, prod) => {
            let product = new Product({
                name: req.body.name,
                price: Number(req.body.price),
                img: req.body.img,
                categoryId: categoryId
            });

            product.save((err, result) => {
                if (err) {
                    res.status(401).json({
                        error: err,
                        message: "Error: failed to create product!"
                    });
                    return;
                }
                res.status(200).json({
                    product: result,
                    message: "Product created successfully!"
                });
            });
        });
});

router.patch('/update', isValidUserAndAdmin, (req, res) => {
    console.log(req.body);
    let productId = req.body.productId;

    Product.findByIdAndUpdate(productId, { $set: { name: req.body.name, price: req.body.price, img: req.body.img } }, (err, product) => {
        if (err) return handleError(err);

        if (product == null) {
            handleMessage(res, 404, {
                message: 'product not found!'
            });
            return;
        }

        handleSuccess(res, {
            product: product,
            message: "Product updated successfully!"
        });

    });
});


function isValidUser(req, res, next) {
    if (req.isAuthenticated()) next();
    else return res.status(401).json({ message: 'Unauthorized Request' });
}

function isValidUserAndAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        User.findById(req.user._id)
            .exec((err, user) => {
                if (err) {
                    handleMessage(res, 404, {
                        err: err
                    });
                    return;
                }

                if (user == null) {
                    handleMessage(res, 404, {
                        message: 'Cant find user id.'
                    });
                    return;
                }

                if (isAdminRole(user['role'])) {
                    next();
                } else {
                    handleMessage(res, 404, {
                        message: 'You are not an admin.',
                        user: user
                    });
                }
            });
    }
    else return res.status(401).json({ message: 'Unauthorized Request' });
}

function isAdminRole(role) {
    if (role.length < 2) {
        return false;
    }
    if (role[0] == 'Member' && role[1] == 'Admin' && role.length == 2) {
        return true;
    }
    return false;
}

function handleMessage(res, status, data) {
    res.status(status).json(data);
}

function handleSuccess(res, data) {
    res.status(200).json(data);
}

module.exports = router;