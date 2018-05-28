var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var authRouter = require('./routes/auth');
var userRouter = require('./routes/api/user');
var orderRouter = require('./routes/api/order');
var productRouter = require('./routes/api/product');
var categoryRouter = require('./routes/api/category');
var shoppingCartRouter = require('./routes/api/shoppingCart');
var cartItemRouter = require('./routes/api/cartItem');

var cors = require('cors');
var app = express();

const env = require('./services/env');

app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  credentials: true
}));

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/supermarket');

//passport
var passport = require('passport');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
app.use(session({
  name: 'myname.sid',
  resave: false,
  saveUninitialized: false,
  secret: 'secret',
  cookie: {
    maxAge: 36000000,
    httpOnly: false,
    secure: false
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

require('./passport-config');
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');

app.use('/users', authRouter);
app.use('/api', userRouter); 
app.use('/api/orders', orderRouter); 
app.use('/api/products', productRouter); 
app.use('/api/category', categoryRouter); 
app.use('/api/shoppingCart', shoppingCartRouter); 
app.use('/api/cartItem', cartItemRouter); 

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(env.port, ()=>{
  console.log("server has been started on port: " + env.port);
});

module.exports = app;
