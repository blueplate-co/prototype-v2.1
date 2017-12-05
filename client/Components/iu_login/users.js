import { Accounts } from 'meteor/accounts-base'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { FilesCollection } from 'meteor/ostrio:files';
import { navbar_find_by } from '/imports/functions/find_by.js';

Template.CreateUser.events({
  'submit #create-user': function(event, template) {
    var user;

    // Collect data and validate it.

    // You can go about getting your data from the form any way you choose, but
    // in the end you want something formatted like so:
    user = {
      username: formUsername,
      password: formPassword,
      email: formEmail,
      profile: {
        name: formName,
        // etc...
      }
    }

    // Post the user to the server for creation
    Accounts.createUser(user, function (error) {
      if (error) {
        // :(
        console.log(error);
      }
    });

    Accounts.validateNewUser(function (user) {
      // Ensure user name is long enough
      if (user.username.length < 5) {
        throw new Meteor.Error(403, 'Your username needs at least 5 characters');
      }

      var passwordTest = new RegExp("(?=.{6,}).*", "g");
      if (passwordTest.test(user.password) == false) {
        throw new Meteor.Error(403, 'Your password is too weak!');
      }

      return true;
    });

    return false;
  }
});
