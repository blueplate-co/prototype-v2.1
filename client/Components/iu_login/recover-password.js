// Ensure we have the token to pass into the template when it's present
if (Accounts._resetPasswordToken) {
  Session.set('resetPasswordToken', Accounts._resetPasswordToken);
}

Template.RecoverPassword.helpers({
  resetPassword: function() {
    return Session.get('resetPasswordToken');
  }
});

Template.RecoverPassword.events({
  'submit #forgot-password': function(event, template) {
    var email = template.find('#user-email'),
      message;

      // You will probably want more robust validation than this!
      if (email) {
        // This will send a link to the address which, upon clicking, prompts the
        user to enter a new password.
        Accounts.forgotPassword(email);
        message = 'Sent a reset password link to ' + email + '.';
      } else {
        message = 'Please enter a valid email address.'
      }

      // Inform the user.
      template.find('#form-messages').html(message);

    return false;
  },
  'submit #set-new-password': function (event, template) {
    // Proper decoupled validation would be much nicer than this
    var password = template.find('#new-password').value,
        passwordTest = new RegExp("(?=.{6,}).*", "g");

    // If the password is valid, we can reset it.
    if (passwordTest.test(password)) {
      Accounts.resetPassword(
        Session.get('resetPasswordToken'),
        password,
        function (error) {
          if (err) {
            template.find('#form-messages').html('There was a problem resetting your password.');
          } else {
            // Get rid of the token so the forms render properly when they come back.
            Session.set('resetPasswordToken', null);
          }
        })
      });
    } else {
      // Looks like they blew it
      template.find('#form-messages').html('Your password is too weak!');
    }

    return false;
  }
});
