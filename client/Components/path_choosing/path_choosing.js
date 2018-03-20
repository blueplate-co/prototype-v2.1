import React from 'react';
import { render}  from 'react-dom';

import PathOption from '../../imports/ui/path_choosing.js';

Template.path_choosing.onRendered(function() {
    render(<PathOption />, document.getElementById('pathOption_container'));
})

Template.path_choosing.events({
  'click #create_homecook_profile': function(){
    FlowRouter.go('/profile/create_homecook_profile')
  },

  'click #preview_foodie_profile': function(){
    var profile_id = Profile_details.findOne({'user_id': this._id})
    var route = '/foodies/:' + String(profile_id)
    FlowRouter.go(route);
  },

  'click #preview_kitchen_profile': function(){
    var profile_id = Kitchen_details.findOne({'user_id': this._id})
    var route = '/kitchen/:' + String(profile_id)
    FlowRouter.go(route);
  },

  'click #create_first_dish': function(){
    FlowRouter.go('/cooking/dishes');
  },

  'click #divert_showroom': function(){
    FlowRouter.go('/main');
  },

})

Template.path_choosing.helpers({

  'check_homecook_profile': function(){
    var check = String(Kitchen_details.findOne({'user_id': Meteor.userId()}))
    if(check === 'undefined'){
      return true;
    } else {
      return false;
    }

},

/*  'check_first_dish': function(){
    var check = dishes.find({user_id: this._id}).length
    if(check===0){
      return true;
    }else{
      return false;
    }
  }, */


})
