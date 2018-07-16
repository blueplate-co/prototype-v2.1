import {
    Meteor
} from 'meteor/meteor';

Meteor.methods({
    'filter.getAddress' () {
        return Profile_details.findOne({user_id: Meteor.userId()}).home_address;
    },
});