'use strict';
//Create variables to help call bcrypt and mongoose dependencies
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

//Set moongoose Promise to global Promise
mongoose.Promise = global.Promise;


//Create a Scehma for vacationLog, which outlines the desired Object
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

//Use virtual method for vacationLog Schema to formate locationName
vacationLogSchema.virtual('locationName').get(function() {
    return `${this.location.city}, ${this.location.country}`.trim();
});

//Use virtual method to format the duration of the user's vacation
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