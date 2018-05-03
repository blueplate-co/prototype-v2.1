import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

Meteor.methods({
  'change_password'(email, password, admin_pass) {
    check(email, String);
    check(password, String);
    var admin_key = "M1ch@ellin"
    if (admin_pass === admin_key) {
      try {
        const user_id = Accounts.findUserByEmail(email)._id;
        Accounts.setPassword(user_id, password)
      }
      catch (error) {
        throw new Meteor.Error('User does not exist');
      }
    } else {
      throw new Meteor.Error('Incorrect admin password.');
    }
  }
})
