'use strict';

require('dotenv').config();
var express = require('express');
const morgan = require('morgan');
// const mongoose = require('mongoose');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;


// mongoose.Promise = global.Promise;

// const { DATABASE_URL, PORT } = require('./config');
// const { router: usersRouter } = require('./users');
// const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

var app = express();

// app.use('/public', express.static(process.cwd() + '/public'))

// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//     res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
//     if (req.method === 'OPTIONS') {
//         return res.send(204);
//     }
//     next();
// });

// passport.use(localStrategy);
// passport.use(jwtStrategy);

// app.use(express.static('public'));
// app.use('/api/users/', usersRouter);
// app.use('/api/auth/', authRouter);

// const jwtAuth = passport.authenticate('jwt', { session: false });

// app.get('/api/protected', jwtAuth, (req, res) => {
//     return res.json({
//         data: 'rosebud'
//     });
// });

// app.use('*', function (req, res) {
//     res.status(404).json({ message: 'Page Not Found' });
// });

// let server;

// function runServer(databaseUrl = DATABASE_URL, port = PORT) {
//     return new Promise((resolve, reject) => {
//         mongoose.connect(databaseUrl, err => {
//             if (err) {
//                 return reject(err);
//             }
//             server = app.listen(port, () => {
//                 console.log(`Your app is listening on port ${port}`);
//                 resolve();
//             })
//             .on('error', err => {
//                 mongoose.disconnect();
//                 reject(err);
//             });
//         });
//     });
// }

// function closeServer() {
//     return mongoose.disconnect().then(() => {
//         return new Promise((resolve, reject) => {
//             console.log('Closing server');
//             server.close(err => {
//                 if (err) {
//                     return reject(err);
//                 }
//                 resolve();
//             });
//         });
//     });
// }

// if (require.main === module) {
//     runServer( ).catch(err => console.error(err));
// }

// module.exports = { runServer, app, closeServer };

// app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/about', function(req, res) {
    res.render('pages/about');
});


app.listen(8080);
console.log('8080 is the right port!')