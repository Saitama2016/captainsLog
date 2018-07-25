'use strict';
//Create variables to help call bcrypt and mongoose dependencies
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

//Set moongoose Promise to global Promise
mongoose.Promise = global.Promise;


//Begin by developing a Schema for Users username, password and email. 
//It should require a unique username and email, and require a password
//It should also store firstName, lastName, and an email
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''},
    email: {
        type: String,
        required: true,
        unique: true
    }
});

//Use bcrypt to validate password
UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

//Use bcrypt to hash password rather than store password
UserSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

UserSchema.methods.serialize = function() {
    return {
        id: this._id,
        username: this.username || '',
        firstName: this.firstName || '',
        lastName: this.lastName || '',
        email: this.email
    }
}

//Create a Scehma for vacationLog to outline the desired Object
const vacationLogSchema = mongoose.Schema({
    flight: String,
    departure: String,
    city: String,
    country: String,
    userID: String
});

const memoriesSchema = mongoose.Schema({
    event: String,
    date: String,
    description: String,
    vacationId: String
})

//Use serialize method to return desired Vacation Log object
vacationLogSchema.methods.serialize = function() {
    return {
        id: this._id,
        flight: this.flight || '',
        departure: this.departure || '',
        city: this.city || '',
        country: this.country || '',
        userID: this.userID
    };
};

memoriesSchema.methods.serialize = function() {
    return {
        id: this._id,
        event: this.event || '',
        date: this.date || '',
        description: this.description || '',
        vacationID: this.vacationID
    };
};

const User =  mongoose.model('User', UserSchema);
const Vacation = mongoose.model('VacationLog', vacationLogSchema);
const Memory = mongoose.model('Memory', memoriesSchema);

module.exports = {User, Vacation, Memory};