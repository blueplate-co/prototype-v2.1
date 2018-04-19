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
import ShowDishProfile from '../../imports/ui/show_dish_profile.js';
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
  this.kitchen_likes = new ReactiveVar(0);
  this.kitchen_tried = new ReactiveVar(0);
  window.scrollTo(0,0);
})

Template.show_homecook_profile.onRendered(function() {
  var instance = Template.instance()
  instance._id.set(FlowRouter.getParam("homecook_id"))
  if (!instance._id.get()) {
    //own kitchen
    Meteor.call('kitchen_likes.get', Meteor.userId(), (error, result) => {
     instance.kitchen_likes.set(result)
    })
  } else {
  // other kitchen profile
    var user_id = Kitchen_details.findOne({'_id': instance._id.get()}).user_id;
    Meteor.call('kitchen_likes.get', user_id, (error, result) => {
      instance.kitchen_likes.set(result)
    })
  }
})

Template.show_homecook_profile.helpers({
  'own_profile': function(){
    var instance = Template.instance()
    instance._id.set(FlowRouter.getParam("homecook_id"))
    if (!instance._id.get()){
      return true;
    } else {
      return false;
    }
  },
  'get_homecook_profile': function(template) {
    var instance = Template.instance()
    instance._id.set(FlowRouter.getParam("homecook_id"))
    if (!instance._id.get()) {
      return Kitchen_details.findOne({
        'user_id': Meteor.userId()
      });
    } else {
      return Kitchen_details.findOne({
        '_id': instance._id.get()
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
        '_id': instance._id.get()
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
        '_id': instance._id.get()
      }).kitchen_tags;
    }
    return kitchen_tags
  },

  'kitchen_like':function(){
    var instance = Template.instance()
    return instance.kitchen_likes.get();
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

Template.show_homecook_profile.events({
  'click #edit_homecook_profile': function() {
    FlowRouter.go('/profile/edit_homecook_profile');
  }
})


Template.homecook_profile_dish_list.onRendered(function() {
  render(<ShowDishProfile/>, document.getElementById('dish_list'));
})
