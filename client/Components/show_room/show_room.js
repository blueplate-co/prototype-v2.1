import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for show room react component
// import ShowRoom from '../../imports/ui/show_room.js';
import ShowRoom from '../../imports/ui/showroom/new_showroom';

Template.show_room.onRendered(function(){
  render(<ShowRoom />, document.getElementById('show_room_container'));
});

Meteor.subscribe('theDishes');
Meteor.subscribe('theMenu');
Meteor.subscribe('theKitchenDetail');
Meteor.subscribe('listAllNotifications');