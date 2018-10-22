import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';
import ShowDishProfile from '../../imports/ui/show_dish_profile.js';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { ReactiveVar } from 'meteor/reactive-var';
import { createCookie, delete_cookies } from '/imports/functions/common/promotion_common';

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
  this.kitchen_follows = new ReactiveVar(0);
  window.scrollTo(0,0);
})

Template.show_homecook_profile.onRendered(function() {
  var instance = Template.instance();
  instance._id.set(FlowRouter.getParam("homecook_id"));
  
  // if (!Kitchen_details.findOne({'user_id': Meteor.userId()}) && !FlowRouter.getParam('homecook_id')) {
  //   FlowRouter.go('/followup');
  // } else {
    if (!instance._id.get()) {
      var user = Meteor.userId()
      //own kitchen
      Meteor.call('kitchen_likes.get', user, (error, result) => {
       instance.kitchen_likes.set(result)
      })
      Meteor.call('kitchen_tried.get', user, (error, result) => {
        instance.kitchen_tried.set(result)
      })
      Meteor.call('kitchen_follows.get', user, (error, result) => {
        instance.kitchen_follows.set(result)
      })
    } else {
      var user = instance._id.get()
    // other kitchen profile
      var kitchen_detail = Kitchen_details.findOne({'_id': user}),
          user_id = '';
      if (kitchen_detail != undefined) {
        user_id = kitchen_detail.user_id
      }
      Meteor.call('kitchen_likes.get', user_id, (error, result) => {
        if (!error) {
          instance.kitchen_likes.set(result)
        }
      })
      Meteor.call('kitchen_tried.get', user_id, (error, result) => {
        if (!error) {
          instance.kitchen_tried.set(result)
        }
      })
      Meteor.call('kitchen_follows.get', user_id, (error, result) => {
        if (!error) {
          instance.kitchen_follows.set(result)
        }
      })
    }
  // }
  
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
    var instance = Template.instance()
    return instance.kitchen_follows.get();
  },

  'kitchen_tried':function(){
    var instance = Template.instance()
    return instance.kitchen_tried.get();
  },
})

Template.show_homecook_profile.events({
  'click #edit_homecook_profile': function() {
    FlowRouter.go('/profile/edit_homecook_profile');
  }
})


Template.homecook_profile_dish_list.onRendered(function() {
  //- procedure for promotion $50HKD
  var url_string = window.location.href; //window.location.href
  var url = new URL(url_string);
  var promotion = url.searchParams.get("promotion");
  // check if already have cookies
  var dc = document.cookie;
  var prefix = "promotion" + "=";
  var begin = dc.indexOf(prefix);
  //- when user already logged in, just apply promotion program for they
  if (Meteor.userId() && promotion) {
    Meteor.call('promotion.check_history', (err, res) => {
      if (Object.keys(res).length == 0) { // this user not already have promotion before
        let amount = parseInt(promotion.replace( /^\D+/g, ''));
        Meteor.call('promotion.insert_history', Meteor.userId(), promotion, amount,  (err, res) => {
          if (err) {
            Materialize.toast(err, 4000, 'rounded bp-green');
          } else {
              delete_cookies('promotion');
              setTimeout(() => {
                $('#promotion_modal').modal();
                $('#promotion_modal').modal('open');
              }, 2000);
            //- end promotion modal
          }
        });
      }
    });
  } else {
    //- when user not logged in, create a cookies to store this program
    if (begin == -1 && promotion) {
      createCookie(promotion, promotion, 'Fri, 31 Dec 9999 23:59:59 GMT');
      setTimeout(() => {
        $('#promotion_modal').modal();
        $('#promotion_modal').modal('open');
      }, 1000);
    }
  }  
  render(<ShowDishProfile/>, document.getElementById('dish_list'));
})
