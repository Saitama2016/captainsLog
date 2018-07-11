'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// const { DATABASE_URL, PORT } = require('./config');
// const { VacationLog } = require('./models');

const app = express();

app.use(morgan('common'));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req,res) => {
    VacationLog
        .find()
        .then(posts => {
            res.json(posts.map(post => post.serialize()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went terribly wrong' });
        });
});

app.get('//:id', (req, res) => {
    VacationLog
        .findById(req.tripUdates.id)
        .then (post => res.json(post.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went wrong' });
        });
});

app.post('/', (req,res) => {
    const requiredFields = ['', '', ''];
    for (let i=0; i<requiredFields.length; i++){
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    VacationLog
        .create({
            //Include duration object and location object
            description: req.body.description
        })
        .then(vacationLog => res.status(201).json(vacationLog.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong'})
        });

});

app.delete('//:id', (req, res) => {
    VacationLog
        .findByIdAndRemove(req.tripUdates.id)
        .then(() => {
            res.status(204).json({ message: 'success' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went wrong' });
        });
});

app.put('//:id', (req, res) => {
    if (!(req.tripUdates.id && req.body.id && req.tripUdates.id === req.body.id)) {
        res.status(400).json({
            error: 'Request path id and request body id values must match'
        });
    }

    const updated = {};
    const updatedableFields = [];
    updatedableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    VacationLog
        .findByIdandUpdate(req.tripUdates.id, { $set: updated }, { new: true })
        .then(updatedPost => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

app.delete('//:id', (req, res) => {
    VacationLog
        .findByIdAndRemove(req.tripUdates.id)
        .then(() => {
            console.log(`Deleted blog post with id \`${req.tripUdates.id}\``);
            res.status(204).end();
        });
});

app.use('*', function (req, res) {
    res.status(404).json({ message: 'Not Found' });
});

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
            sever.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    app.listen(process.env.PORT || 8080, function() {
        console.info(`App listening on ${this.address().port}`);
    });
}

module.exports = {runServer, app, closeServer };