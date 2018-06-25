import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Blaze } from 'meteor/blaze';

Template.admin_screen.helpers({
  'logging_in': function() {
    return Meteor.loggingIn()
  }
})

Template.render_mainscreen.onRendered(function() {
  if (Meteor.user()) {
    var email = Meteor.user().emails[0].address;
    if (email.indexOf('@blueplate.co') === -1) {
      FlowRouter.go('/internal/access_denied');
    }
  } else {
    FlowRouter.go('/');
  }
})
