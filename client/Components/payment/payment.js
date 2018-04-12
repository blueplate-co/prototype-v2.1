import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for payment react component
import Payment from '../../imports/ui/payment';

Template.payment.onRendered(function(){
  render(<Payment />, document.getElementById('payment_container'));
});