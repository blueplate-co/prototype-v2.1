import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for payment react component
import MapWrapper from '../../imports/ui/map_wrapper';

Template.kitchen_mapping.onRendered(function(){
  render(<MapWrapper/>, document.getElementById('kitchen_map_container'));
});
