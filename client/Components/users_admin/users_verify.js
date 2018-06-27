import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for payment react component
import UsersVerify from '../../imports/ui/users_verify';

Template.users_verify.onRendered(function(){
  render(<UsersVerify />, document.getElementById('users_verify_container'));
});
