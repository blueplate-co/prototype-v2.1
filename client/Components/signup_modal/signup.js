import { Template } from 'meteor/templating';
import React from 'react';
import { render } from 'react-dom';

import SignUp from '../../imports/ui/signup.js';

Template.signup_modal.onRendered(function(){
  $('#signup_modal').modal({
    startingTop: '0%',
    endingTop: '0%',
  });

  render (<SignUp />, document.getElementById('signup_modal'));
});
