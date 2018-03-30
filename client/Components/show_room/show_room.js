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

});

Meteor.subscribe('theDishes');
Meteor.subscribe('theMenu');
Meteor.subscribe('theIngredients');
// Meteor.subscribe('theShoppingCart');
// Meteor.subscribe('theOrderRecordSeller');
// Meteor.subscribe('theOrderRecordBuyer');
Meteor.subscribe('theProfileDetail');
Meteor.subscribe('theKitchenDetail');
Meteor.subscribe('getDishesLikes');
Meteor.subscribe('getMenusLikes');
Meteor.subscribe('getKitchensLikes');
// Meteor.subscribe('theTransactionSeller');
// Meteor.subscribe('theTransactionBuyer');
// Meteor.subscribe('theNotificationsSender');
// Meteor.subscribe('theNotificationsReceiver');
// Meteor.subscribe('theImages');
// Meteor.subscribe('theOrderRatings');

