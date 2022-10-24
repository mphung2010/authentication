// installed third party packages
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

//modules for authentication
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');

//database setup
let mongoose = require('mongoose');
let DB = require('./db');

// point mongoose to the DB URI
mongoose.connect(DB.URI, {useNewUrlParser: true, useUnifiedTopology: true});

let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', ()=>{
  console.log('Connected to MongoDB...');
});

let indexRouter = require('../routes/index');     // router path updated
let usersRouter = require('../routes/users');     // router path updated
let contactsRouter = require('../routes/contact');  // router added (defined)

let app = express();  //creating express app

// view engine setup
app.set('views', path.join(__dirname, '../views'));  //setting views in application
app.set('view engine', 'ejs');    // setting view engine in application

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));   //path updated
app.use(express.static(path.join(__dirname, '../../node_modules')));   //path updated

//setup express session
app.use(session({
  secret: "SomeSecret",
  saveUninitialized: false,
  resave: false
}));

// initialize flash - it shows the error message 
//after the person is redirected to login screen after failed attempt
app.use(flash());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// passport user configuration

// create a user model instance
let userModel = require('../models/user');
let User = userModel.User;

//implement a User Authentication Strategy
passport.use(User.createStrategy());

// serialize and deserialize the User info
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contact-list', contactsRouter);   // router is used here

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
  res.render('error', { title: 'Error' });
});

module.exports = app;