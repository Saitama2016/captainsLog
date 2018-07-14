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
    firstName: {type: String},
    lastName: {type: String},
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

//Create a Scehma for vacationLog to outline the desired Object
const vacationLogSchema = mongoose.Schema({
    duration: {
        arrival: Date,
        departure: Date
    },
    location: {
        city: String,
        country: String
    },
    description: {type: String, required: true},
    created: {type: Date, default: Date.now}
});

//Use virtual method for vacationLog Schema to create locationName
//Virtual creates additional properties on the fly [DRY]
vacationLogSchema.virtual('locationName').get(function() {
    return `${this.location.city}, ${this.location.country}`.trim();
});

//Use virtual method to create a property to log duration of user's vacation
vacationLogSchema.virtual('durationLength').get(function() {
    return `Arrival: ${this.duration.arrival} Departure: ${this.location.country}`.trim();
});

//Use serialize method to return desired Vacation Log object
vacationLogSchema.methods.serialize = function() {
    return {
        id: this._id,
        duration: this.durationLength,
        location: this.locationName,
        description: this.description,
        created: this.created
    };
};

const VacationLog = mongoose.model('VacationLog', vacationLogSchema);

module.exports = {VacationLog};