import { address_geocode } from '/imports/functions/address_geocode.js';

export function navbar_find_by(collection){
  var location = Session.get('address');
  var method = Session.get('method');


  if (collection) {
    if (location) {
      address_geocode('location', location);
      Meteor.call('mapping.check_radius', Session.get('location'), 5, function(error, result){
        if (error) {
          Materialise.toast(error, 4000, "rounded red lighten-2");
        }
        if (method) {
          //location: T, method: T
          //console.log(collection + 'location: T, method: T');
          var kitchen_id = [];
          kitchen_id = result.map(function(kitchen){return kitchen._id});
          //console.log(kitchen_id);
          if (collection === "Kitchen_details") {
            var searched_result = Collections[collection].find({
              '_id': {$in: kitchen_id},
              'serving_option': method,
              'user_id':{$ne: Meteor.userId()},
              'kitchen_address_conversion.lng':{$ne: null},
              'kitchen_address_conversion.lat':{$ne: null}
            });
            //console.log(searched_result);
            Session.set('searched_result', searched_result.fetch());
          } else {
            var searched_result =  Collections[collection].find({
              'kitchen_id': {$in: kitchen_id},
              'serving_option': method,
              'user_id':{$ne: Meteor.userId()}
            });
            //console.log(searched_result);
            Session.set('searched_result', searched_result.fetch());
          }
        } else if (!method) {
          //location: T, method: F
          //console.log(collection + 'location: T, method: F');
          var kitchen_id = [];
          kitchen_id = result.map(function(kitchen){return kitchen._id});
          //console.log(kitchen_id);
          if (collection === "Kitchen_details") {
              var searched_result = Collections[collection].find({
                '_id': {$in: kitchen_id},
                'user_id':{$ne: Meteor.userId()},
                'kitchen_address_conversion.lng':{$ne: null},
                'kitchen_address_conversion.lat':{$ne: null}
              });
              //console.log(searched_result);
              Session.set('searched_result', searched_result.fetch());
          } else {
            var searched_result = Collections[collection].find({
              'kitchen_id': {$in: kitchen_id},
              'user_id':{$ne: Meteor.userId()}
            })
            Session.set('searched_result', searched_result.fetch());
          }
        }
      });
    } else if (method) {
      //location: F, method: T
      //console.log(collection + 'location: F, method: T');
      var searched_result = Collections[collection].find({
        'serving_option': method,
        'user_id':{$ne: Meteor.userId()},
        'kitchen_address_conversion.lng':{$ne: null},
        'kitchen_address_conversion.lat':{$ne: null}
      })
      Session.set('searched_result', searched_result.fetch());
    } else {
      //location: F, method: F
      //console.log(collection + 'location: F, method: F');
      var searched_result = Collections[collection].find({
        'user_id':{$ne: Meteor.userId()},
        'kitchen_address_conversion.lng':{$ne: null},
        'kitchen_address_conversion.lat':{$ne: null}
      })
      Session.set('searched_result', searched_result.fetch());
    }
  }

}
