const express = require('express');
const router = express.Router();
const Category = require('../../models/category');
var passport = require('passport');

router.get('/getCategories', isValidUser, (req, res) => {
    Category.find({}, (err, categories) => {
        if (err) {
            handleMessage(res, 404, {
                error: err
            });
            return;
        }
        handleSuccess(res, {
            data: categories
        });
    });
});

router.post('/add', isValidUserAndAdmin, (req, res) => {
    let category = new Category({
        name: req.body.name
    });

    category.save((err, result) => {
        if (err) {
            res.status(401).json({
                error: err,
                message: "Error: failed to create category!"
            });
            return;
        }
        res.status(200).json({
            order: result,
            message: "Category created successfully!"
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