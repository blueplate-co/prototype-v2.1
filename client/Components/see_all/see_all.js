import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

import ShowRoom from '../../imports/ui/show_room';


Template.see_all.onRendered(function(){
  // render show room container from REACT
  var type = FlowRouter.getParam('type')
  switch (type) {
    case 'dish':
      render(<ShowRoom screen="all_dish"/>, document.getElementById('see_all_container'));
      break;
    case 'menu':
      render(<ShowRoom screen="all_menu"/>, document.getElementById('see_all_container'));
      break;
    case 'kitchen':
      render(<ShowRoom screen="all_kitchen"/>, document.getElementById('see_all_container'));
      break;
    default:
      render(<ShowRoom screen="all_dish"/>, document.getElementById('see_all_container'));
      break;
  }
});