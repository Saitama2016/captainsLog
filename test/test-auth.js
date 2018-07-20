const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');
const { User } = require('../users');

const expect = chai.expect;

chai.use(chaiHttp);

//Begin to describe Auth endpoints
describe('Auth endpoints', function() {
    //Create variables used for authorizations
    const username = 'exampleUser';
    const password = 'examplePass';
    const firstName = 'Vinny';
    const lastName = 'Gee';
    const email = 'example@example.com';

    //create before function to run server with TEST_DATABASE_URL
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    after(function () {
        return closeServer();
    });

    beforeEach(function() {
        return User.hashPassword(password).then(password => 
            User.create({
                username,
                password,
                firstName,
                lastName,
                email
            })
        );
    });

    afterEach(function () {
        return User.remove({});
    });

    //Begin describe path to authorized login
    describe('/api/auth/login', function () {
        it('Should reject requests with no credentials', function () {
            return chai
                .request(app)
                .post('/api/auth/login')
                .then(() =>
                    expect.fail(null, null, 'Request should not succeed')
                )
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(400);
                });
            });
        it('Should reject requests with incorrest usernames', function () {
            return chai 
                .request(app)
                .post('api/auth/login')
                .send({ username: 'wrongUsername', password })
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
        
        it('Should reject requests with incorrest passwords', function () {
            return chai 
                .request(app)
                .post('api/auth/login')
                .send({ username, password: 'wrongPassword' })
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
        
        it('Should return a valid auth token', function () {
            return chai
                .request(app)
                .post('api/auth/login')
                .send({ username, password })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    const token = res.body.authToken;
                    expect(token).to.be.a('string');
                    const payload = jwt.verify(token, JWT_SECRET, {
                        algorithm: ['HS256']
                    });
                    expect(payload.user).to.deep.equal({
                        id: payload.user.id,
                        username,
                        firstName,
                        lastName,
                        email
                    });
                });
        });
    });

    describe('/api/auth/refresh', function () {
        it('Should reject requests with no credentials', function () {
            return chai
                .request(app)
                .post('/api/auth/refresh')
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
        it('Should reject requests with an invalid token', function () {
            const token = jwt.sign(
                {
                    username,
                    firstName,
                    lastName
                },
                'wrongSecret',
                {
                    algorithm: 'HS256',
                    expiresIn: '7d'
                }
            );

            return chai
                .request(app)
                .post('/api/auth/refresh')
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
        it('Should reject requests with an expired token', function () {
            const token = jwt.sign(
                {
                    user: {
                        username,
                        firstName,
                        lastName
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
                .post('/api/auth/refresh')
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
        
        it('Should return a valid auth token with a newer expiry date', function () {
            const token = jwt.sign(
                {
                    user: {
                        username,
                        firstName,
                        lastName,
                        email
                    }
                },
                JWT_SECRET,
                {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: '7d'
                }
            );
            const decoded = jwt.decode(token);

            return chai
                .request(app)
                .post('/api/auth/refresh')
                .set('authprization', `Bearer ${token}`)
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    const token = res.body.authToken;
                    expect(token).to.be.a('string');
                    const payload = jwt.verify(token, JWT_SECRET, {
                        algorithm: ['HS256']
                    });
                    expect(payload.user).to.deep.equal({
                        username,
                        firstName,
                        lastName,
                        email
                    });
                    expect(payload.exp).to.be.at.least(decoded.exp);
                });
        });
    })
})