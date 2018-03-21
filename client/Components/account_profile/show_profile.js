import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';
import {
  checkboxes_recall
} from '/imports/functions/checkboxes_recall.js'
import {
  address_geocode
} from '/imports/functions/address_geocode.js'
import {
  get_checkboxes_value
} from '/imports/functions/get_checkboxes_value.js'



Template.show_foodie_profile.helpers({
  'get_foodie_profile': function() {
    return Profile_details.findOne({
      'user_id': Meteor.userId()
    });
  },

})

Template.show_homecook_profile.helpers({
  'get_homecook_profile': function() {
    return Kitchen_details.findOne({
      'user_id': Meteor.userId()
    });
  },
  'speciality_tag':function(){
    return Kitchen_details.find({
      'user_id': Meteor.userId()
    }).kitchen_speciality.tag.fetch();
  }
})
