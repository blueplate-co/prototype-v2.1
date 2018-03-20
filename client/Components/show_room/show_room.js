import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { Meteor } from 'meteor/meteor';
import { navbar_find_by } from '/imports/functions/find_by.js';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for show room react component
import ShowRoom from '../../imports/ui/show_room.js';

Template.show_room.onRendered(function(){


  // render show room container from REACT
  render(<ShowRoom />, document.getElementById('show_room_container'));

  $('.map_wrapper').pushpin({
    top: 0,
    bottom: 1500,
    offset: 65
  });
  $('#large_dish_display').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '4%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
      if ($('.modal-overlay').length > 1) {
        $('.modal-overlay').each(function(){ // remove all modal-overlay when its not have any id attr
          if ($(this).attr('id') == undefined) {
              $(this).remove();
          }
        });
      }
    },
    complete: function(){ $('.modal-overlay').remove(); } // callback when modal close done
  });
  $('#menu_card_display').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '4%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
      if ($('.modal-overlay').length > 1) {
        $('.modal-overlay').each(function(){ // remove all modal-overlay when its not have any id attr
          if ($(this).attr('id') == undefined) {
              $(this).remove();
          }
        });
      }
    },
    complete: function(){ $('.modal-overlay').remove(); } // callback when modal close done
  });
});

Template.show_room_dish.helpers ({
  'find_dishes_by': function(){
    var kitchen_info = Session.get('searched_result');
    var kitchen_id = [];
    if (kitchen_info) {
      for (i = 0; i < kitchen_info.length; i++) {
        kitchen_id[i] = kitchen_info[i]._id;
      }
    }
    return Dishes.find({kitchen_id: {$in: kitchen_id}, online_status: true, deleted: false});
  }
});

Template.show_room_menu.helpers ({
  'find_menu_by': function(){
    var kitchen_info = Session.get('searched_result');
    var kitchen_id = [];
    if (kitchen_info) {
      for (i = 0; i < kitchen_info.length; i++) {
        kitchen_id[i] = kitchen_info[i]._id;
      }
    }
    return Menu.find({kitchen_id: {$in: kitchen_id}, online_status: true, deleted: false});
  }
});

Template.show_room_chef.helpers ({
  'find_kitchen_by': function(){
    navbar_find_by("Kitchen_details")
    return Session.get('searched_result');
  }
});

Meteor.subscribe('theDishes');
Meteor.subscribe('theMenu');

Meteor.subscribe('theProfileImages');
Meteor.subscribe('theIngredients');
Meteor.subscribe('theShoppingCart');
Meteor.subscribe('theOrderRecordSeller');
Meteor.subscribe('theOrderRecordBuyer');
Meteor.subscribe('theProfileDetail');
Meteor.subscribe('theKitchenDetail');
Meteor.subscribe('theTransactionSeller');
Meteor.subscribe('theTransactionBuyer');
Meteor.subscribe('theNotificationsSender');
Meteor.subscribe('theNotificationsReceiver');
Meteor.subscribe('theImages');
Meteor.subscribe('theOrderRatings');
