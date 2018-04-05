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
import SelfDishList from '../../imports/ui/self_dish_list.js';
import SelfMenuList from '../../imports/ui/self_menu_list.js';
import DishList from '../../imports/ui/dish_list.js';
import MenuList from '../../imports/ui/menu_list.js';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { ReactiveVar } from 'meteor/reactive-var';


Template.show_foodie_profile.helpers({
  'get_foodie_profile': function() {
    return Profile_details.findOne({
      'user_id': Meteor.userId()
    });
  },

})

Template.show_homecook_profile.onCreated(function() {
  this._id = new ReactiveVar(null);
  window.scrollTo(0,0);
})

Template.show_homecook_profile.helpers({
  'get_homecook_profile': function(template) {
    var instance = Template.instance()
    instance._id.set(FlowRouter.getParam("homecook_id"))
    if (!instance._id.get()) {
      return Kitchen_details.findOne({
        'user_id': Meteor.userId()
      });
    } else {
      return Kitchen_details.findOne({
        'user_id': instance._id.get()
      });
    }
  },

  'kitchen_speciality':function(){
    var instance = Template.instance()
    if (!instance._id.get()) {
      var kitchen_speciality = Kitchen_details.findOne({
        'user_id': Meteor.userId()
      }).kitchen_speciality;
    } else {
      var kitchen_speciality = Kitchen_details.findOne({
        'user_id': instance._id.get()
      }).kitchen_speciality;
    }
    return kitchen_speciality
  },

  'kitchen_tags':function(){
    var instance = Template.instance()
    if (!instance._id.get()) {
      var kitchen_tags = Kitchen_details.findOne({
        'user_id': Meteor.userId()
      }).kitchen_tags;
    } else {
      var kitchen_tags = Kitchen_details.findOne({
        'user_id': instance._id.get()
      }).kitchen_tags;
    }
    return kitchen_tags
  },

  'kitchen_like':function(){
    var dishes_likes = 0
    var menu_likes = 0
    var instance = Template.instance()

    if (!instance._id.get()) {
      var user_id = Meteor.userId();
    } else {
      var user_id = instance._id.get();
    }
    Dishes.find({ "user_id": user_id }).map(function (doc) {
      if(doc.like === undefined){
        dishes_likes += 0
      }else{
          dishes_likes += parseInt(doc.like.length);
      }

    });

    Menu.find({ "user_id": user_id }).map(function (doc) {
      if(doc.like === undefined){
        menu_likes += 0
      }else{
          menu_likes += parseInt(doc.like.length);
      }
    });
    return dishes_likes + menu_likes
  },

  'kitchen_follow':function(){
    var kitchen_follow = 0
    var instance = Template.instance()
    if (!instance._id.get()) {
      var user_id = Meteor.userId();
    } else {
      var user_id = instance._id.get();
    }

    Kitchen_details.find({ "user_id": user_id }).map(function (doc) {
      if(doc.follow === undefined){

        kitchen_follow += 0
      }else{
          kitchen_follow += parseInt(doc.follow.length);
      }

    });
    return kitchen_follow
  },

  'kitchen_tried':function(){
    var kitchen_tried = 0
    var instance = Template.instance()
    if (!instance._id.get()) {
      var user_id = Meteor.userId();
    } else {
      var user_id = instance._id.get();
    }

    Kitchen_details.find({ "user_id": Meteor.userId() }).map(function (doc) {
      if(doc.follow === undefined){

        kitchen_tried += 0
      }else{
          kitchen_tried += parseInt(doc.follow.length);
      }

    });
    return kitchen_tried
  },
})


Template.homecook_profile_dish_list.onRendered(function() {
  if (!FlowRouter.getParam('homecook_id')) {
    render(<SelfDishList />, document.getElementById('dish_list'));
  } else {
    render(<DishList />, document.getElementById('dish_list'));
  }
})

Template.homecook_profile_menu_list.onRendered(function() {
  if (!FlowRouter.getParam('homecook_id')) {
    render(<SelfMenuList />, document.getElementById('menu_list'));
  } else {
    render(<MenuList />, document.getElementById('menu_list'));
  }
})
