import { Template } from 'meteor/templating';


// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// custom component
import TopNavigation from '../../imports/ui/top_navigation';
import Message from '../../imports/ui/message';



Template.navbar.onRendered(function(){


  render(<TopNavigation />, document.getElementById('top-navigation-container'));
  render(<Message />, document.getElementById('chat-panel'));

});
