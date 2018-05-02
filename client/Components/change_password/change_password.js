import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';


Template.change_password.events({
  'click #btn_submit_change_password': function(event) {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirm_password = document.getElementById('confirm_password').value;
    const admin_pass = document.getElementById('admin_password').value;

    if (password != confirm_password) {
      alert('Your password does not match, please try again')
    } else {
      Meteor.call('change_password', email, password, admin_pass, (error, result) => {
        if (!error) {
          alert('Password has been changed.')
        } else {
          alert(error.name + ':' + error.message)
        }
      });
    }
  }
})
