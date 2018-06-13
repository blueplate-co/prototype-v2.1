import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for payment react component
import KitchenMap from '../../imports/ui/kitchen_map';

Template.kitchen_mapping.onRendered(function(){
  render(<KitchenMap />, document.getElementById('ktichen_map_container'));
});
