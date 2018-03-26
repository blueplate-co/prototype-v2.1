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
import DishList from '../../imports/ui/dish_list.js';
import MenuList from '../../imports/ui/menu_list.js';
import React, { Component } from 'react';
import { render } from 'react-dom';


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
  'kitchen_speciality':function(){
    var kitchen_speciality = Kitchen_details.findOne({
      'user_id': Meteor.userId()
    }).kitchen_speciality;
    return kitchen_speciality
  },
  'kitchen_tags':function(){
    var kitchen_tags = Kitchen_details.findOne({
      'user_id': Meteor.userId()
    }).kitchen_tags;
    return kitchen_tags
  },
})


Template.homecook_profile_dish_list.onRendered(function() {

  render(<DishList />, document.getElementById('dish_list'));

})

Template.homecook_profile_menu_list.onRendered(function() {

  render(<MenuList />, document.getElementById('menu_list'));

})
