import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for payment react component
import Util from '../../imports/ui/util';

Template.util.onRendered(function(){
  render(<Util />, document.getElementById('util_container'));
});