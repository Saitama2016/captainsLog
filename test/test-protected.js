global.DATABASE_URL = 'mongodb://localhost/jwt-auth-demo-test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users');
const {JWT_SECRET, TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;

describe('Protected endpoint', function() { 
    const username = 'exUsername';
    const password = 'exPassword';
    const token = jwt.sign(
        {
            user: {
                username,
            }
        },
        JWT_SECRET,
        {
            algorithm: 'HS256',
            subject: username,
            expiresIn: '7d'
        }
    );

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    after(function() {
        return closeServer();
    })

    beforeEach(function() {
        return User.hashPassword(password).then(password =>
        User.create({
            username,
            password
        })
        );
    });

    afterEach(function() {
        return User.remove({})
    });

    describe('/api/users/vacation', function() {
        it('Should reject request with no credentials', function() {
            return chai
            .request(app)
            .get('/api/users/vacation')
            .then(() => 
                expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
            if (err instanceof chai.AssertionError) {
                throw err;
            }

            const res = err.response;
            expect(res).to.have.status(401);
        });
        });

        it('Should reject requests with an invalid token', function() {
            const token = jwt.sign(
                {
                    username,
                },
                'wrongSecret',
                {
                    algorithm: 'HS256',
                    expiresIn: '7d'
                }
            );

            return chai
                .request(app)
                .get('/api/users/vacation')
                .set('Authorization', `Bearer ${token}`)
                .then(() =>
                    expect.fail(null, null, 'Request should not succeed')
            )
            .catch(err => {
                if (err instanceof chai.AssertionError) {
                    throw err;
                }

                const res = err.response;
                expect(res).to.have.status(401);
            });
        });
        it('Should reject requests with an expired token', function() {
            const token = jwt.sign(
                {
                    user: {
                        username
                    },
                    exp: Math.floor(Date.now() / 1000) - 10
                },
                JWT_SECRET,
                {
                    algorithm: 'HS256',
                    subject: username
                }
            );

            return chai
                .request(app)
                .get('/api/users/vacation')
                .set('authorization', `Bearer ${token}`)
                .then(() =>
                    expect.fail(null, null, 'Request should not succeed')
            )
            .catch(err => {
                if (err instanceof chai.AssertionError) {
                    throw err;
                }

                const res = err.response;
                expect(res).to.have.status(401);
            });
        });
        it('Should send protected data', function() {
            return chai
                .request(app)
                .get('/api/users/vacation')
                .set('authorization', `Bearer ${token}`)
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.vacation).to.be.an('array');
                });
        });
    });
});
