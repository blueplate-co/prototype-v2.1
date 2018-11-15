import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for show room react component
import ShowRoom from '../../imports/ui/show_room.js';

Template.show_room.onRendered(function(){

  // render show room container from REACT
  render(<ShowRoom />, document.getElementById('show_room_container'));

});

Meteor.subscribe('listAllNotifications');