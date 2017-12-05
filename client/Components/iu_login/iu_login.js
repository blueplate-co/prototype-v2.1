import { Accounts } from 'meteor/accounts-base'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { FilesCollection } from 'meteor/ostrio:files';
import { navbar_find_by } from '/imports/functions/find_by.js';

// Template.iu_login.events({
//   'submit form': function(event) {
//     event.preventDefault();
//     var emailVar = event.target.loginEmail.value;
//     var passwordVar = event.target.loginPassword.value;
//
//     Meteor.loginWithPassword(emailVar, passwordVar);
//   }
// });

Template.Login.events({
    'submit #login': function(event, template) {
      // 1. Collect the username and password from the form
      var username = template.find('#login-username').value,
          password = template.find('#login-password').value;

      // 2. Attempt to login.
      Meteor.loginWithPassword(username, password, function(error) {
          // 3. Handle the response
          if (Meteor.user()) {
              // Redirect the user to where they're loggin into. Here, Router.go uses
              // the iron:router package.
              Router.go('Internal User');
          } else {
              // If no user resulted from the attempt, an error variable will be available
              // in this callback. We can output the error to the user here.
              var message = "There was an error logging in: <strong>" + error.reason + "</strong>";

              template.find('#form-messages').html(message);
          }

          return;
      });

      return false;
    }
});
