'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

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

vacationLogSchema.virtual('locationName').get(function() {
    return `${this.location.city}, ${this.location.country}`.trim();
});

vacationLogSchema.virtual('durationLength').get(function() {
    return `Arrival: ${this.duration.arrival} Departure: ${this.location.country}`.trim();
});

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