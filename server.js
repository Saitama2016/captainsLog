'use strict';

require('dotenv').config();
var express = require('express');
const morgan = require('morgan');
// const mongoose = require('mongoose');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;

passport.use(new Strategy(
    function(username, passowrd, cb) {
        db.users.findByUsername(username, function(err, user) {
            if (err) { return eb(err); }
            if (!user) { return cb(null, false); }
            if(user.password != password) { return cb(null, false); }
            return cb(null, user);
        })
    }));

passport.serializeUser(function(user, cb){
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    db.users.findById(id, function (err, user) {
        if(err) { return cb(err); }
        cb(null, user);
    });
});

var app = express();


// app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(require('morgan')('combined'));
// app.use(require('cookie-parser')());
// app.use(require('body-parser').urlencoded({ extended: true }));
// app.use(require('express-session')({ secret: 'ultra instinct', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/login', function(req, res) {
    res.render('pages/login');
});

app.get('/about', function(req, res) {
    res.render('pages/about');
});


app.listen(8080);
console.log('8080 is the right port!')