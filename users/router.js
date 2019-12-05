const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const { router: authRouter, localStrategy, jwtStrategy } = require('../auth');
const {User, Vacation, Memory} = require('./models');

const router = express.Router();

passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', { session: false });

router.use(bodyParser.json());

router.post('/', (req, res) => {
    const requiredFields = ['username', 'password', 'firstName', 'lastName', 'email'];
    const missingField = requiredFields.find(field => !(field in req.body));

    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }

    const stringFields = ['username', 'password', 'firstName', 'lastName', 'email'];
    const nonStringField = stringFields.find(
        field => field in req.body && typeof req.body[field] !== 'string'
    );

    if (nonStringField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Incorrect field type: expected string',
            location: nonStringField
        });
    }

    /*
    If the username and password aren't trimmed we give an error. User might
    expect that these will work without trimming (i.e. they want the password
    "foobar ", including the space at the end).
    */
    const explicityTrimmedFields = ['username', 'password'];
    const nonTrimmedField = explicityTrimmedFields.find(
        field => req.body[field].trim() !== req.body[field]
    );

    if (nonTrimmedField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Cannot start or end with whitespace',
            location: nonTrimmedField
        });
    }

    const sizedFields = {
        username: {
            min: 1
        },
        password: {
            min: 10,
            max: 72
        }
    };

    const tooSmallField = Object.keys(sizedFields).find(
        field =>
            'min' in sizedFields[field] &&
                req.body[field].trim().length < sizedFields[field].min
    );

    const tooLargeField = Object.keys(sizedFields).find(
        field => 
            'max' in sizedFields[field] &&
                req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField
                ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
                : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
            location: tooSmallField || tooLargeField
        });
    }

    let {username, password, firstName = '', lastName = '', email = ''} = req.body;

    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();

    return User.find({username})
        .count()
        .then(count => {
            if (count > 0) {
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Username already taken',
                    location: 'username'
                });
            }
            return User.hashPassword(password);
        })
        .then(hash => {
            return User.create({
                username,
                password: hash,
                firstName,
                lastName,
                email
            });
        })
        .then(user => {
            return res.status(201).json(user.serialize());
        })
        .catch(err => {
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({code: 500, message: 'Internal server error'});
        });
});

//Add a new Vacation
router.post('/vacation/:id', jwtAuth, (req, res) => {
    const requiredFields = ['city', 'country', 'flight', 'departure', 'userID'];
    const missingField = requiredFields.find(field => !(field in req.body));

    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }

    const user = req.params.id;

    if(req.body.userID != user) {
        return res.status(500).json({
            code: 400,
            reason: 'ValidationError',
            message: 'id must match endpont',
            location: 'userID'
        });
    }

    const sizedFields = {
        city: {
            min: 1,
            max: 20
        },
        country: {
            min: 1,
            max: 74
        }
    };

    const tooSmallField = Object.keys(sizedFields).find(
        field =>
            'min' in sizedFields[field] &&
                req.body[field].trim().length < sizedFields[field].min
    );

    const tooLargeField = Object.keys(sizedFields).find(
        field => 
            'max' in sizedFields[field] &&
                req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField
                ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
                : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
            location: tooSmallField || tooLargeField
        });
    }

    let {city, country, flight = '', departure = '', userID} = req.body;
    
    flight = flight.trim();
    departure = departure.trim();
    userID = userID.trim();

    return Vacation.create({
        city,
        country,
        flight,
        departure,
        userID
    })
    .then(vacations => {
        console.log(vacations);
        return res.status(201).json(vacations.serialize());
    })
    .catch(err => {
        if (err.reason === 'ValidationError') {
            return res.status(err.code).json(err);
        }
        console.log(err);
        res.status(500).json({code: 500, message: `Internal server error: ${err}`});
    });
});

router.post('/memories/:id', jwtAuth, (req, res) => {
    const requiredFields = ['event', 'description', 'date', 'vacationID'];
    const missingField = requiredFields.find(field => !(field in req.body));

    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }

    const vacation = req.params.id;

    if(req.body.vacationID != vacation) {
        return res.status(500).json({
            code: 400,
            reason: 'ValidationError',
            message: 'id must match endpoint',
            location: 'vacationID'
        });
    }

    let {event = '', description = '', date = '', vacationID = ''} = req.body;

    event = event.trim();
    description = description.trim();
    date =  date.trim();
    vacationID = vacationID.trim();

    return Memory.create({
        event,
        description,
        date,
        vacationID
    })
    .then(memory => res.status(201).json(memory.serialize()))
    .catch(err => {
        if (err.reason === 'ValidationError') {
            return res.status(err.code).json(err);
        }
        console.log(err);
        res.status(500).json({code: 500, message: `Internal server error: ${err}`});
    });

});

router.put('/vacation/:id', jwtAuth, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (
            `Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).json({ message: message });
    }

    const toUpdate = {};
    const requiredFields = ['id', 'city', 'country', 'flight', 'departure'];

    requiredFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    Vacation
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(() => {
        console.log(`Updating user \`${req.params.id}\``);
        res.status(204).end();
    })
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.put('/memories/:id', jwtAuth, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (
            `Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).json({ message: message });
    }

    const toUpdate = {};
    const requiredFields = ['id', 'date', 'event', 'description'];

    requiredFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    Memory
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(() => {
        console.log(`Updating user \`${req.params.id}\``);
        res.status(204).end();
    })
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.get('/', (req, res) => {
    return User.find()
        .then(users => res.json(users.map(user => user.serialize())))
        .catch(err => res.status(500).json({message: `Internal server error: ${err}`}));
});

router.get('/vacation', (req, res) => {
    return Vacation.find()
        .then(vacations => res.json(vacations.map(vacation => vacation.serialize())))
        .catch(err => res.status(500).json({message: `Internal server error: ${err}`}));
});

router.get('/vacation/:id', jwtAuth, (req, res) => {
    const user = req.params.id; 
    Vacation
        .find({
            userID: user
        })
        .then(vacations => res.json(vacations.map(vacation => vacation.serialize())))
        .catch(err => res.status(500).json({message: `Internal server error: ${err}`}));
});

router.get('/vacation/single/:id', jwtAuth, (req, res) => {
    const id = req.params.id; 
    Vacation
        .findById(id)
        .then(vacation => res.json(vacation.serialize()))
        .catch(err => res.status(500).json({message: `Internal server error: ${err}`}));
});

router.get('/memories', (req, res) => {
    return Memory.find()
        .then(memories => res.json(memories.map(memory => memory.serialize())))
        .catch(err => res.status(500).json({message: `Internal server error: ${err}`}));
});

router.get('/memories/:id', jwtAuth, (req, res) => {
    const vacation = req.params.id; 
    Memory
        .find({
            vacationID: vacation
        })
        .then(memories => res.json(memories.map(memory => memory.serialize())))
        .catch(err => res.status(500).json({message: `Internal server error: ${err}`}));
});

router.get('/:id', (req, res) => {
    User
        .findById(req.params.id)
        .then(post => res.json(post.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: `Internal server error: ${err}` });
        });
});

router.delete('/vacation/:id', jwtAuth, (req, res) => {
    console.log(req.params.id);

    const vacationsId = req.params.id;

    Memory
        .remove({
            vacationID: vacationsId
        })
        .then(() => {
            console.log(`You have deleted all memories related to vacationId: ${vacationsId}`);
            Vacation
            .findByIdAndRemove(vacationsId)
            .then(() => {
                console.log(`You have deleted user vacation id:${vacationsId}`);
                res.status(204).end();
            })
            .catch(err => res.status(500).json({ message: `Internal server error: ${err}` }));
        })
        .catch(err => res.status(500).json({ message: `Internal server error: ${err}` }));
});

router.delete('/memories/:id', jwtAuth, (req, res) => {
    console.log(req.params.id);
    Memory
        .findByIdAndRemove(req.params.id)
            .then(() => {
                console.log(`You have deleted post id:${req.params.id}`);
                res.status(204).end();
            })
            .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.delete('/:id', (req, res) => {
    console.log(req.params.id);
    User
        .findByIdAndRemove(req.params.id)
            .then(() => {
                console.log(`You have deleted post id:${req.params.id}`);
            })
            .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = {router};