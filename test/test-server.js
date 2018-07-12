'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {VacationLog} = require();
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

// const expect = chai.expect;

chai.use(chaiHttp);

function generateVacationLogData() {
    return {
        duration: {
            arrival: faker.lorem.date(),
            departure: faker.lorem.date()
        },
        location: {
            city: faker.lorem.city(),
            country: faker.lorem.country()
        },
        description: faker.lorem.sentence()
    };
}

function seedVacationLogData() {
    console.info('seeding vacation data');
    const seedData = [];
    for (let i=1; i<=10; i++) {
        seedData.push(generateVacationLogData());
    }
    return VacationLog.insertMany(seedData);
}

function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting database');
        mongoose.connection.dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

describe('Vacation Log API resource', function () {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedVacationLogData();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });
})

describe()

describe('index page', function() {
    it('should exist', function() {
        return chai
            .request(app)
            .get('/')
            .then(function(res) {
                expect(res).to.have.status(200);
            });
    });
});