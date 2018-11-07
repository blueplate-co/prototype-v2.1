import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for payment react component
import Deposit from '../../imports/ui/deposit';

Template.deposit.onRendered(function(){
  if(!Meteor.userId()){ 
    FlowRouter.go("/login");
    // util.loginAccession('/deposit');
  }

  render(<Deposit />, document.getElementById('deposit_container'));
});