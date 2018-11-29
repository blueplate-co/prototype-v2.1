import { Template } from 'meteor/templating';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for show room react component
import ShowRoom from '../../imports/ui/show_room.js';

Template.wish_list.onRendered(function(){
  render(<ShowRoom screen="wish_list"/>, document.getElementById('wish_list_container'));
});