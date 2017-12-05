import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

if(Meteor.isClient){
  Template.iu_register.events({
    'submit form': function(event, template){
      event.preventDefault();
      var emailVal = template.find('#register-email').value;
      var passVal = template.find('#register-password').value;
      Accounts.createUser({
        email: emailVal,
        password: passVal
      });
      FlowRouter.go('AccountIU');
    }
  });

  Template.iu_login.events({
    'submit form': function(event, template){
      event.preventDefault();
      var emailVal = template.find('#login-email').value;
      var passVal = template.find('#login-password').value;
      Meteor.loginWithPassword(emailVal, passVal);
    }
  });
}
