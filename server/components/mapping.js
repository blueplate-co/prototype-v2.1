import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';
import { check } from 'meteor/check';

Markers = new Mongo.Collection('markers');

// set permission for Markers collection
Markers.deny({
  update() { return true; },
  remove() { return true; }
});

Meteor.methods({
  'mapping.check_radius'(center_location, radius) {
    check(center_location, Match.Any);
    check(radius, Match.Any);
    var searched_kitchen = Kitchen_details.find({
      kitchen_address_conversion: {"$geoWithin": {"$centerSphere": [[center_location.lng,center_location.lat], radius/6371]}}
    }).fetch();
    console.log(searched_kitchen);
    return searched_kitchen;
  }
});

Meteor.methods({
  'mapping.nearby'(lat, lng, radius) {
    var searched_kitchen = Kitchen_details.find({
      kitchen_address_conversion: {"$geoWithin": {"$centerSphere": [[ lng, lat], radius/6371]}}
    }).fetch();
    return searched_kitchen;
  }
});


//the problem right now is MongoDb take lng, lat, but google map takes lat, lng
//I need to convert the document fields to mongodb order to make "find" works
