var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
const jwt = require('jsonwebtoken');
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/register', function (req, res, next) {
  addToDB(req, res);
});


async function addToDB(req, res) {
  console.log(req.body);
  var user = new User({
    name: req.body.name,
    lastName: req.body.lastName,
    email: req.body.email,
    id: req.body.id,
    address: req.body.address,
    street: req.body.street,
    role: ["Member"],
    password: User.hashPassword(req.body.password),
    creation_dt: Date.now()
  });

  try {
    doc = await user.save();
    return res.status(201).json(doc);
  }
  catch (err) {
    return res.status(501).json(err);
  }
}

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return res.status(501).json(err); }
    if (!user) { return res.status(501).json(info); }
    req.logIn(user, function (err) {
      if (err) {
        res.status(501).json(err);
        return;
      }
      res.status(200).json({ message: 'Login Success' });
      return;
    });
  })(req, res, next);
});

router.get('/user', isValidUser, function (req, res, next) {
  return res.status(200).json(req.user);
});

router.get('/isAdmin', isValidUserAndAdmin, function (req, res, next) {
  return res.status(200).json(true);
});

router.get('/isLogged', isValidUser, function (req, res, next) {
  return res.status(200).json(true);
});


router.get('/logout', isValidUser, function (req, res, next) {
  req.logout();
  return res.status(200).json({ message: 'Logout Success' });
})

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
            message: 'You are not an admin.'
          });
          return;
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
