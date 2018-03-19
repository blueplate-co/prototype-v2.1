import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Accounts } from 'meteor/accounts-base';

Template.reset_password.events({
  'click #reset_button': function(event) {
    event.preventDefault();
    var reset_token = FlowRouter.getParam('token'),
        password = $('#password').val(),
        confirm_password = $('#confirm_password').val();
    if (password != confirm_password) {
      Materialize.toast('Your passwords do not match, please try again', 4000, "rounded bp-green");
    } else {
      Accounts.resetPassword(reset_token,password, function(err){
        if (err) {
          var text = err.message;
          Materialize.toast('Sorry, ' + text,4000,"rounded bp-green");
        } else {
          FlowRouter.go('/reset_redirect');
        }
      })
    }
  }
});
