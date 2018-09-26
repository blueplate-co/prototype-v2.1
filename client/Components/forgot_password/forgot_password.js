Template.forgot_password.events({
  'click #submit_forgot_password': function(event) {
    event.preventDefault();

    email = $('#forgot_password_email').val().toLowerCase();

    if (email && isEmail(email)) {
      util.show_loading_progress()
      Accounts.forgotPassword({email: email}, function(err) {
        if (err) {
          util.hide_loading_progress();
          if (err.message === 'User not found [403]') {
            $('.message_response').text('This email does not exist. Please try again.');
          } else {
            $('.message_response').text('We are sorry but something went wrong. Please try again. ' + err.message);
          }
        } else {
          $('#login_modal').modal('close');
          $('.forgot_password').remove();
          $('#login_modal').append(login_content);
          util.hide_loading_progress();
          Materialize.toast('An email has been sent to you. Please click the link given to reset your password', 6000, 'rounded bp-green');
          // $('.message_response').text('An email has been sent to the address above. Please click the link given to reset your password.');
        }
      });
    }
    return false;
  },

  'click #cancel_forgot_password': function() {
    $('.forgot_password').remove();
    $('#login_modal').append(login_content);
  }
})
