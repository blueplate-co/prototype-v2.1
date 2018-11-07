import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Blaze } from 'meteor/blaze';
import { delete_cookies, getCookie } from '/imports/functions/common/promotion_common';
import { render } from 'react-dom';
import React from 'react';

import './login_modal.html';
import LoginPage from '../../imports/ui/login_page';

Template.login_page.onRendered(function(){
  render (<LoginPage />, document.getElementById('login_page'));
});

//   'click .login-google':function(event){
//     event.preventDefault();
//     Meteor.loginWithGoogle({}, function(err){
//       $('#loginLoader').show(); // show the loader
//       if (err) {
//         $('#loginLoader').hide(); // hide the loader
//         console.log('Handle errors here: ', err);
//       } else {
//         $('#loginLoader').hide(); // hide the loader
//         localStorage.setItem("loggedIn", true);
//         FlowRouter.go("/");
//         $('#login_modal').modal('close');
//       }
//     });
//   },
