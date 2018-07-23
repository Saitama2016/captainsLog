'use strict';

require('dotenv').config();
var express = require('express');
const morgan = require('morgan');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');

var app = express();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS'){
        return res.send(204);
    }
    next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('api/users', usersRouter);
app.use('/api/auth', authRouter);

// app.use('*', function(req, res) {
//     res.status(404).json({ message: 'Page Not Found '});
// });

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve();
            })
            .on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

passport.use(new Strategy(
    function(username, password, cb) {
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


// app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(require('morgan')('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(require('cookie-parser')());
// app.use(require('express-session')({ secret: 'ultra instinct', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
    res.render('pages/index');
});

app.post('/vacations', function(req, res) {
    res.render('pages/vacations');
});

app.get('/vacations', function(req, res) {
    res.render('pages/vacations', {user: req.params.name});
});

app.post('/vacations/:name', function(req, res) {
    res.render('pages/vacations', {user: req.params.name});
});

app.get('/vacations/:name', function(req, res) {
    res.render('pages/vacations', {user: req.params.name});
});

app.post('/memory', function(req, res) {
    res.render('pages/memory');
});

app.get('/memory', function(req, res) {
    res.render('pages/memory');
});

app.post('/about', function(req,res) {
    res.render('pages/about');
});

app.get('/about', function(req, res) {
    res.render('pages/about');
});

if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
// app.listen(8080);
// console.log('8080 is the right port!')