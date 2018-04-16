import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './signup.html';

Template.signup_modal.onRendered(function(){
  $('#signup_modal').modal({
    startingTop: '0%',
    endingTop: '0%',
  });
});

Template.signup_modal.events({
  'click .login-facebook':function(event){
    event.preventDefault();
    Meteor.loginWithFacebook({requestPermissions:['public_profile','email']}, function(err){
      if (err) {
        console.log('Handle errors here: ', err);
      } else {
        FlowRouter.go("/main");
        $('#login_modal').modal('close');
      }
    });
  },
  'click .login-google':function(event){
    event.preventDefault();
    Meteor.loginWithGoogle({}, function(err){
      if (err) {
        console.log('Handle errors here: ', err);
      } else {
        FlowRouter.go("/main");
        $('#login_modal').modal('close');
      }
    });
  },
  'click #signup, keypress': function(event){
    if (event.which === 1||event.which === 13) {
      var email = trimInput($('#signup_email').val());
      var password = trimInput($('#signup_password').val());
      var cpassword = trimInput($('#signup_cpassword').val());
      var chef_signup = Session.get('chef_signup');
    //  var last_name = trimInput(event.target.last_name.value);
    //  var first_name = trimInput(event.target.first_name.value);
      if( isNotEmpty(email)      &&
          isNotEmpty(password)   &&
    //      isNotEmpty(last_name)  &&
    //      isNotEmpty(first_name) &&
          isEmail(email)         &&
          areValidPassword(password, cpassword)) {
            Accounts.createUser({
              email: email,
              password: password,
              profile: {
                chef_signup: chef_signup,
              }
            }, function(err){
              if(err){
                Bert.alert(err.reason,"danger", "growl-top-right");
              } else {
                Blaze.render(Template.verification, document.getElementById('signup_content'));
                $('.signup_form').remove();
                $('.signup_submit_btn').remove();
                $('.signup_cancel_btn').html('Close');
                Meteor.call('sendVerificationEmail', Meteor.userId(),function(err, response) {
                  if (!err) {
                    //- create Stripe user id for that user register
                    Meteor.call('payment.createCustomer', Meteor.users.findOne({_id:Meteor.userId()}).emails[0].address);
                  }
                });
              }
            });
          }
          return false;
        }
    },
    'click #resend_verification': function(){
      Meteor.call('sendVerificationEmail', Meteor.userId());
    }
});

//Validation rules
//Trim Helper
var trimInput = function(value){
  return value.replace(/^\s*|\s*$/g,"");
}

var isNotEmpty = function(value){
  if (value && value !== ''){
    return true;
  }
  Bert.alert("Email or password fields cannot be blank", "danger", "growl-top-right");
  return false;
}
//Email Validation
isEmail = function(value){
  var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if(filter.test(value)){
    return true;
  }
  Bert.alert("Please use a valid email address","danger","growl-top-right")
  return false;
}
//Check Password fields
isValidPassword=function(password){
  if(password.length < 8){
  Bert.alert("Password must be greater than 8 charaters", "danger","growl-top-right");
    return false;
  }
    return true;
  };
//Match Password
areValidPassword = function(password, cpassword){
  if(!isValidPassword(password)){
    return false;
  }
  if(password !== cpassword){
    Bert.alert("Password and confirm password mismatch. Please try again !","danger","growl-top-right");
    return false;
  }
    return true;
}

//- validating email
var validateEmail = function(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
