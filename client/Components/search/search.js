import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for show room react component
import ShowRoom from '../../imports/ui/show_room.js';

Template.search.onRendered(function(){
  render(<ShowRoom screen="search" />, document.getElementById('search_container'));
});