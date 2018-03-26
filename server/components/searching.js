import {
    Meteor
} from 'meteor/meteor';

Meteor.methods({
    'searching' (location, service, date, time) {
        return {
            location: location,
            service: service,
            date: date,
            time: time
        }
    }
});