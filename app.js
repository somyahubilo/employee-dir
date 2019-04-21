const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("body-parser");
const mongoose  = require("mongoose");
const session  = require("express-session");
const MongoStore = require("connect-mongo")(session);

const connection = mongoose.connect(
  "mongodb://rikan1:rikan1@ds159204.mlab.com:59204/testdatabase",
  { useNewUrlParser: true }
);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const { User } = require ("./models/users");

const app = express();


var credentials = {
  emailAddress: "somya.ricky@gmail.com",
  password: "admin@123",
};
var newAdmin = new User(credentials);
User.findOne({ emailAddress: credentials.emailAddress })
  .then(admin => {
    if (!admin) {
      newAdmin.save();
    }
  })
  .catch(err => {
    //console.log(err);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: "123test",
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
  })
);

app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.error = req.session.error;

  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
