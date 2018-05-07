import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for payment react component
import Deposit from '../../imports/ui/deposit';

Template.deposit.onRendered(function(){
  render(<Deposit />, document.getElementById('deposit_container'));
});